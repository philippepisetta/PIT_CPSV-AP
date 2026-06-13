# 🔍 Render Deployment Failure Analysis: Exit Status 134

This document details the diagnostic analysis and resolution of the deployment failure on Render for the latest backend commits.

---

## 📊 Summary of Failure

*   **Failing Step**: Runtime Startup (Start Command execution of `npm start`)
*   **Failing File**: [src/server.ts](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/src/server.ts)
*   **Failing Line**: N/A (Compilation phase crash during V8 heap allocation)
*   **Root Cause**: Memory exhaustion (Out-Of-Memory) due to on-the-fly TypeScript compilation by `ts-node` at startup.
*   **Target Environment**: Render Web Service (Free/Basic instance, limited to **512 MB RAM**)

---

## 🔎 Root Cause Diagnosis

### 1. The Startup Mechanism
In the previous configuration, the startup command on Render was configured to run `npm start`, which executes:
```bash
ts-node src/server.ts
```
`ts-node` compiles TypeScript files *on the fly* at runtime. This requires spawning the full TypeScript compiler (`tsc`) in memory, loading type definitions, parsing the AST, and generating JS code in memory before execution.

### 2. Massive File Growth
As of Sprint 4.5.B, the backend service has grown significantly:
*   `src/server.ts` is now a single monolithic file of **5,428 lines** (187 KB) containing many endpoints.
*   The database schema `schema.prisma` has expanded to **1,120 lines**, which generates a very large `@prisma/client` with complex nested relation types.

When `ts-node` typechecks `src/server.ts` alongside all Prisma client generated types, the memory footprint spikes massively during this compilation phase.

### 3. Empirical Verification of Memory Footprint
We ran a local comparison of memory usage between the on-the-fly (`ts-node`) compilation and the pre-compiled version (`node` running compiled JS):

| Execution Mode | Startup Command | Working Set (RAM) | Private Memory | Memory reduction |
| :--- | :---: | :---: | :---: | :---: |
| **On-the-fly (`ts-node`)** | `ts-node src/server.ts` | **405.75 MB** | **393.20 MB** | Baseline |
| **Pre-compiled (`node`)** | `node dist/src/server.js` | **56.72 MB** | **37.02 MB** | **-86.0%** |

#### Analysis:
*   **On-the-fly**: Even *after* compilation is complete, the running process retains a memory footprint of over **405 MB** (Working Set) just to stay idle. During the initial compilation phase, memory usage spikes even higher, easily exceeding the **512 MB** limit of the Render instance. This causes V8 to fail heap allocation and abort, exiting with **Exit Status 134** (`SIGABRT`).
*   **Pre-compiled**: Directly running the compiled JavaScript using standard `node` drops memory usage to only **56.72 MB**, fitting easily within the Render resource limits.

---

## 🛠️ The Exact Fix

To resolve the memory exhaustion crash, we must separate the compilation phase (build) from the execution phase (start) on Render.

### 1. Update `package.json`
We have modified the root `package.json` to:
*   Add a `"build": "tsc"` script to compile the TypeScript code before running.
*   Change the `"start"` script to run the pre-compiled JavaScript file using standard Node.js (`node dist/src/server.js`).
*   Add a `"dev"` script (`ts-node src/server.ts`) to preserve fast local on-the-fly execution during development.

```json
  "scripts": {
    "build": "tsc",
    "start": "node dist/src/server.js",
    "dev": "ts-node src/server.ts",
    "seed": "ts-node prisma/seed.ts",
    "postinstall": "prisma generate",
    "pit:audit": "ts-node tests/pit-auditor/audit.ts",
    "pit:audit:prod": "cross-env PIT_TARGET_URL=https://pit-cpsv-ap.vercel.app ts-node tests/pit-auditor/audit.ts"
  }
```

### 2. Render Dashboard Configuration Changes
To apply the pre-compilation, the service settings in the Render Dashboard must be updated:

1.  **Build Command**:
    *   *Old*: `npm install`
    *   *New*: `npm install && npm run build` (This installs packages, runs `postinstall` to generate the Prisma client, and then runs `tsc` to compile files to the `dist/` directory during the build phase).
2.  **Start Command**:
    *   Keep/Set to `npm start` (which now runs `node dist/src/server.js`).

This ensures that the heavy compilation work happens during the build phase (which has relaxed memory limits on Render) rather than at server startup (which is strictly throttled to 512MB).
