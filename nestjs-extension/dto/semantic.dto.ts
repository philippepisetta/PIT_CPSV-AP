import { ApiProperty } from '@nestjs/swagger';

export class CreateValueChainDto {
  @ApiProperty({ description: 'Nom de la filière', example: 'Agroalimentaire' })
  name: string;

  @ApiProperty({ description: 'URI sémantique de la filière', required: false, example: 'https://pit.wallonie.be/id/value-chain/agroalimentaire' })
  uri?: string;

  @ApiProperty({ description: 'Description de la filière', required: false, example: 'Production et transformation de produits agricoles.' })
  description?: string;
}

export class ValueChainResponseDto extends CreateValueChainDto {
  @ApiProperty({ description: 'Identifiant unique', example: 1 })
  id: number;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}

export class CreateValueChainStageDto {
  @ApiProperty({ description: 'Nom du maillon', example: 'Production' })
  name: string;

  @ApiProperty({ description: 'URI sémantique du maillon', required: false, example: 'https://pit.wallonie.be/id/stage/production' })
  uri?: string;

  @ApiProperty({ description: 'Description du maillon', required: false })
  description?: string;
}

export class ValueChainStageResponseDto extends CreateValueChainStageDto {
  @ApiProperty({ description: 'Identifiant unique', example: 1 })
  id: number;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}

export class CreateEcosystemRoleDto {
  @ApiProperty({ description: 'Nom du rôle', example: 'Transformateur' })
  name: string;

  @ApiProperty({ description: 'URI sémantique du rôle', required: false, example: 'https://pit.wallonie.be/id/role/transformateur' })
  uri?: string;

  @ApiProperty({ description: 'Description du rôle', required: false })
  description?: string;
}

export class EcosystemRoleResponseDto extends CreateEcosystemRoleDto {
  @ApiProperty({ description: 'Identifiant unique', example: 1 })
  id: number;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}

export class CreateBusinessNeedDto {
  @ApiProperty({ description: 'Libellé du besoin', example: 'Automatiser le contrôle qualité' })
  name: string;

  @ApiProperty({ description: 'URI sémantique du besoin', required: false, example: 'https://pit.wallonie.be/id/need/automatiser-controle-qualite' })
  uri?: string;

  @ApiProperty({ description: 'Description détaillée du besoin', required: false })
  description?: string;

  @ApiProperty({ description: 'Identifiants des filières cibles', required: false, type: [Number] })
  valueChainIds?: number[];

  @ApiProperty({ description: 'Identifiants des maillons cibles', required: false, type: [Number] })
  valueChainStageIds?: number[];

  @ApiProperty({ description: 'Identifiants des services CPSV-AP liés', required: false, type: [Number] })
  serviceIds?: number[];
}

export class BusinessNeedResponseDto extends CreateBusinessNeedDto {
  @ApiProperty({ description: 'Identifiant unique', example: 1 })
  id: number;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}

export class CreateCompanyDto {
  @ApiProperty({ description: 'Nom de l\'entreprise', example: 'Biscuiterie Dupont' })
  name: string;

  @ApiProperty({ description: 'Taille de l\'entreprise', example: 'PME' })
  size: string;

  @ApiProperty({ description: 'Secteur d\'activité principal', example: 'Agroalimentaire' })
  sector: string;

  @ApiProperty({ description: 'Localisation de l\'établissement principal', example: 'Namur' })
  location: string;

  @ApiProperty({ description: 'Demande textuelle / Problématique exprimée', required: false })
  demand?: string;

  @ApiProperty({ description: 'Score de maturité numérique Digiscore (sur 100)', required: false, example: 45 })
  digiscoreScore?: number;

  @ApiProperty({ description: 'Niveau de maturité numérique', required: false, example: 'Moyen' })
  digiscoreLevel?: string;

  @ApiProperty({ description: 'Date du Digiscore', required: false })
  digiscoreDate?: Date;

  @ApiProperty({ description: 'Filières associées (IDs)', required: false, type: [Number] })
  belongsToValueChainIds?: number[];

  @ApiProperty({ description: 'Maillons occupés (IDs)', required: false, type: [Number] })
  participatesInStageIds?: number[];

  @ApiProperty({ description: 'Rôles dans l\'écosystème (IDs)', required: false, type: [Number] })
  playsRoleIds?: number[];

  @ApiProperty({ description: 'Besoins sémantiques exprimés (IDs)', required: false, type: [Number] })
  needIds?: number[];
}

export class CompanyResponseDto extends CreateCompanyDto {
  @ApiProperty({ description: 'Identifiant unique', example: 1 })
  id: number;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}

export class CreateJourneyStepDto {
  @ApiProperty({ description: 'Nom de l\'étape', example: 'Diagnostic initial' })
  name: string;

  @ApiProperty({ description: 'Position ordonnée de l\'étape', example: 1 })
  position: number;

  @ApiProperty({ description: 'ID du service CPSV-AP lié', required: false, example: 1 })
  serviceId?: number;
}

export class JourneyStepResponseDto extends CreateJourneyStepDto {
  @ApiProperty({ description: 'Identifiant unique de l\'étape', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID du parcours associé', example: 1 })
  journeyId: number;
}

export class CreateJourneyDto {
  @ApiProperty({ description: 'Nom du parcours', example: 'Parcours d\'automatisation IA vision' })
  name: string;

  @ApiProperty({ description: 'Fournisseur / Opérateur principal du parcours', example: 'EDIH & AdN' })
  provider: string;

  @ApiProperty({ description: 'URI sémantique du parcours', required: false })
  uri?: string;

  @ApiProperty({ description: 'Objectif du parcours', required: false })
  objective?: string;

  @ApiProperty({ description: 'Besoins associés (IDs)', required: false, type: [Number] })
  needIds?: number[];

  @ApiProperty({ description: 'Filières concernées (IDs)', required: false, type: [Number] })
  valueChainIds?: number[];

  @ApiProperty({ description: 'Maillons concernés (IDs)', required: false, type: [Number] })
  valueChainStageIds?: number[];

  @ApiProperty({ description: 'Étapes du parcours', type: [CreateJourneyStepDto] })
  steps: CreateJourneyStepDto[];
}

export class JourneyResponseDto extends CreateJourneyDto {
  @ApiProperty({ description: 'Identifiant unique', example: 1 })
  id: number;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}
