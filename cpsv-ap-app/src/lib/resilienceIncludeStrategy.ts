// cpsv-ap-app/src/lib/resilienceIncludeStrategy.ts

export const riskRegisterInclude = {
  risks: {
    where: { isActive: true },
    select: {
      id: true,
      code: true,
      name: true,
      category: true,
      severity: true,
      likelihood: true,
      riskScore: true,
      isActive: true,
    }
  }
};

export const riskInclude = {
  riskRegister: {
    select: {
      id: true,
      name: true,
      status: true,
    }
  },
  threats: true,
  hazards: true,
  scenarios: {
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      horizon: true,
      probability: true,
      severity: true,
      isActive: true,
    }
  },
  organizations: {
    select: {
      id: true,
      name: true,
    }
  },
  territories: {
    select: {
      id: true,
      name: true,
    }
  },
  assets: {
    select: {
      id: true,
      name: true,
      assetType: true,
    }
  }
};

export const threatInclude = {
  risk: {
    select: {
      id: true,
      name: true,
      category: true,
    }
  }
};

export const hazardInclude = {
  risk: {
    select: {
      id: true,
      name: true,
      category: true,
    }
  }
};

export const scenarioInclude = {
  risk: {
    select: {
      id: true,
      name: true,
      category: true,
    }
  },
  riskAssessments: {
    where: { isActive: true },
    include: {
      organization: { select: { id: true, name: true } },
      territory: { select: { id: true, name: true } }
    }
  },
  resilienceImpacts: true,
};

export const riskAssessmentInclude = {
  scenario: {
    select: {
      id: true,
      name: true,
      riskId: true,
    }
  },
  risk: {
    select: {
      id: true,
      name: true,
      category: true,
    }
  },
  organization: {
    select: {
      id: true,
      name: true,
    }
  },
  territory: {
    select: {
      id: true,
      name: true,
    }
  },
  policyEvidences: {
    select: {
      id: true,
      title: true,
      url: true,
    }
  }
};

export const resilienceImpactInclude = {
  scenario: {
    select: {
      id: true,
      name: true,
    }
  },
  organization: {
    select: {
      id: true,
      name: true,
    }
  },
  territory: {
    select: {
      id: true,
      name: true,
    }
  },
  ecosystem: {
    select: {
      id: true,
      name: true,
    }
  },
  resilienceMeasures: {
    select: {
      id: true,
      name: true,
      measureType: true,
      status: true,
    }
  }
};

export const resilienceMeasureInclude = {
  resilienceImpacts: {
    select: {
      id: true,
      name: true,
      category: true,
    }
  },
  publicService: {
    select: {
      id: true,
      name: true,
    }
  }
};

export const resilienceProfileInclude = {
  organization: {
    select: {
      id: true,
      name: true,
    }
  },
  territory: {
    select: {
      id: true,
      name: true,
    }
  },
  ecosystem: {
    select: {
      id: true,
      name: true,
    }
  }
};

export const dependencyInclude = {
  criticalInfrastructure: {
    select: {
      id: true,
      name: true,
      type: true,
    }
  },
  organizations: {
    select: {
      id: true,
      name: true,
    }
  },
  assets: {
    select: {
      id: true,
      name: true,
      assetType: true,
    }
  }
};

export const criticalInfrastructureInclude = {
  dependencies: {
    select: {
      id: true,
      name: true,
      category: true,
      criticalLevel: true,
    }
  },
  territories: {
    select: {
      id: true,
      name: true,
    }
  }
};

export const vulnerabilityInclude = {
  organizations: {
    select: {
      id: true,
      name: true,
    }
  },
  assets: {
    select: {
      id: true,
      name: true,
      assetType: true,
    }
  }
};

export const territorialAssetInclude = {
  organization: {
    select: {
      id: true,
      name: true,
    }
  },
  territory: {
    select: {
      id: true,
      name: true,
    }
  },
  ecosystem: {
    select: {
      id: true,
      name: true,
    }
  },
  risks: {
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      category: true,
    }
  },
  dependencies: {
    select: {
      id: true,
      name: true,
      category: true,
    }
  },
  vulnerabilities: {
    select: {
      id: true,
      name: true,
      category: true,
    }
  }
};

export const RESILIENCE_INCLUDES: Record<string, any> = {
  'risk-registers': riskRegisterInclude,
  'risks': riskInclude,
  'threats': threatInclude,
  'hazards': hazardInclude,
  'scenarios': scenarioInclude,
  'risk-assessments': riskAssessmentInclude,
  'resilience-impacts': resilienceImpactInclude,
  'resilience-measures': resilienceMeasureInclude,
  'resilience-profiles': resilienceProfileInclude,
  'dependencies': dependencyInclude,
  'critical-infrastructures': criticalInfrastructureInclude,
  'vulnerabilities': vulnerabilityInclude,
  'territorial-assets': territorialAssetInclude,
};
