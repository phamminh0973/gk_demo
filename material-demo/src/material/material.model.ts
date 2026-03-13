export enum MaterialType {
  API = "API",
  Excipient = "Excipient",
  DietarySupplement = "Dietary Supplement",
  Container = "Container",
  Closure = "Closure",
  ProcessChemical = "Process Chemical",
  TestingMaterial = "Testing Material"
}

export interface Material {
  material_id: string;
  part_number: string;
  material_name: string;
  material_type: MaterialType;
  storage_conditions?: string;
  specification_document?: string;
  created_date: string;
  modified_date: string;
}

export interface CreateMaterialDto {
  part_number: string;
  material_name: string;
  material_type: MaterialType;
  storage_conditions?: string;
  specification_document?: string;
}

export type UpdateMaterialDto = Partial<CreateMaterialDto>;
