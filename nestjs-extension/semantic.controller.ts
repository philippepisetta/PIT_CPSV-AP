import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SemanticService } from './semantic.service';
import {
  CreateCompanyDto, CompanyResponseDto,
  CreateJourneyDto, JourneyResponseDto,
  CreateBusinessNeedDto, BusinessNeedResponseDto,
  CreateValueChainDto, ValueChainResponseDto,
  CreateValueChainStageDto, ValueChainStageResponseDto,
  CreateEcosystemRoleDto, EcosystemRoleResponseDto
} from './dto/semantic.dto';

@ApiTags('Intelligent Territorial Platform (PIT)')
@Controller('api')
export class SemanticController {
  constructor(private readonly semanticService: SemanticService) {}

  // --- FILIERES / VALUE CHAINS ---
  @Post('value-chains')
  @ApiOperation({ summary: 'Créer une filière économique (ValueChain)' })
  @ApiResponse({ status: 201, type: ValueChainResponseDto })
  async createValueChain(@Body() dto: CreateValueChainDto) {
    return this.semanticService.createValueChain(dto);
  }

  @Get('value-chains')
  @ApiOperation({ summary: 'Lister toutes les filières économiques' })
  @ApiResponse({ status: 200, type: [ValueChainResponseDto] })
  async getValueChains() {
    return this.semanticService.getValueChains();
  }

  // --- MAILLONS / STAGES ---
  @Post('stages')
  @ApiOperation({ summary: 'Créer un maillon de chaîne de valeur (ValueChainStage)' })
  @ApiResponse({ status: 201, type: ValueChainStageResponseDto })
  async createValueChainStage(@Body() dto: CreateValueChainStageDto) {
    return this.semanticService.createValueChainStage(dto);
  }

  @Get('stages')
  @ApiOperation({ summary: 'Lister tous les maillons' })
  @ApiResponse({ status: 200, type: [ValueChainStageResponseDto] })
  async getValueChainStages() {
    return this.semanticService.getValueChainStages();
  }

  // --- ROLES ECOSYSTEME ---
  @Post('roles')
  @ApiOperation({ summary: 'Créer un rôle écosystémique (EcosystemRole)' })
  @ApiResponse({ status: 201, type: EcosystemRoleResponseDto })
  async createEcosystemRole(@Body() dto: CreateEcosystemRoleDto) {
    return this.semanticService.createEcosystemRole(dto);
  }

  @Get('roles')
  @ApiOperation({ summary: 'Lister tous les rôles écosystémiques' })
  @ApiResponse({ status: 200, type: [EcosystemRoleResponseDto] })
  async getEcosystemRoles() {
    return this.semanticService.getEcosystemRoles();
  }

  // --- BESOINS METIER ---
  @Post('business-needs')
  @ApiOperation({ summary: 'Créer un besoin métier (BusinessNeed)' })
  @ApiResponse({ status: 201, type: BusinessNeedResponseDto })
  async createBusinessNeed(@Body() dto: CreateBusinessNeedDto) {
    return this.semanticService.createBusinessNeed(dto);
  }

  @Get('business-needs')
  @ApiOperation({ summary: 'Lister tous les besoins métiers' })
  @ApiResponse({ status: 200, type: [BusinessNeedResponseDto] })
  async getBusinessNeeds() {
    return this.semanticService.getBusinessNeeds();
  }

  // --- ENTREPRISES ---
  @Post('companies')
  @ApiOperation({ summary: 'Créer/Enregistrer une entreprise (Company)' })
  @ApiResponse({ status: 201, type: CompanyResponseDto })
  async createCompany(@Body() dto: CreateCompanyDto) {
    return this.semanticService.createCompany(dto);
  }

  @Get('companies')
  @ApiOperation({ summary: 'Lister toutes les entreprises et leurs liaisons' })
  @ApiResponse({ status: 200, type: [CompanyResponseDto] })
  async getCompanies() {
    return this.semanticService.getCompanies();
  }

  @Get('companies/:id')
  @ApiOperation({ summary: 'Obtenir les détails d\'une entreprise par son ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: CompanyResponseDto })
  async getCompanyById(@Param('id', ParseIntPipe) id: number) {
    return this.semanticService.getCompanyById(id);
  }

  // --- RECOMMANDATION SEMANTIQUE ---
  @Get('recommender/:companyId')
  @ApiOperation({ summary: 'Moteur de recommandation sémantique basé sur le besoin' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiResponse({ status: 200, description: 'Besoins, services CPSV et parcours recommandés.' })
  async getRecommendations(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.semanticService.getRecommendationsForCompany(companyId);
  }

  // --- PARCOURS TYPES ---
  @Post('journeys')
  @ApiOperation({ summary: 'Créer un modèle de parcours d\'accompagnement' })
  @ApiResponse({ status: 201, type: JourneyResponseDto })
  async createJourney(@Body() dto: CreateJourneyDto) {
    return this.semanticService.createJourney(dto);
  }

  @Get('journeys')
  @ApiOperation({ summary: 'Lister tous les modèles de parcours' })
  @ApiResponse({ status: 200, type: [JourneyResponseDto] })
  async getJourneys() {
    return this.semanticService.getJourneys();
  }

  // --- KNOWLEDGE GRAPH STRUCTURE ---
  @Get('graph')
  @ApiOperation({ summary: 'Obtenir la structure du graphe de connaissances' })
  @ApiResponse({ status: 200, description: 'Nœuds et relations prêts pour un affichage interactif.' })
  async getKnowledgeGraph() {
    return this.semanticService.getKnowledgeGraph();
  }
}
