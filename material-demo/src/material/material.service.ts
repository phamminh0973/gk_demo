import { AppError } from "../common/http-error";
import {
  CreateMaterialDto,
  Material,
  MaterialType,
  UpdateMaterialDto
} from "./material.model";
import { MaterialListFilter, MaterialRepository } from "./material.repository";

const allowedTypes = new Set<string>(Object.values(MaterialType));

const normalizeOptionalText = (value: unknown, field: string): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new AppError(400, `${field} must be a string`);
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const requireText = (value: unknown, field: string): string => {
  if (typeof value !== "string") {
    throw new AppError(400, `${field} is required and must be a string`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new AppError(400, `${field} is required`);
  }

  return trimmed;
};

export class MaterialService {
  constructor(private readonly materialRepository: MaterialRepository) {}

  list(filter: MaterialListFilter): Material[] {
    return this.materialRepository.list(filter);
  }

  getById(materialId: string): Material {
    const material = this.materialRepository.findById(materialId);
    if (!material) {
      throw new AppError(404, "Material not found");
    }

    return material;
  }

  create(payload: Record<string, unknown>): Material {
    const createDto = this.validateCreatePayload(payload);
    this.assertPartNumberUnique(createDto.part_number);

    const createdAt = new Date().toISOString();
    const material: Material = {
      material_id: this.generateMaterialId(),
      ...createDto,
      created_date: createdAt,
      modified_date: createdAt
    };

    return this.materialRepository.create(material);
  }

  update(materialId: string, payload: Record<string, unknown>): Material {
    this.getById(materialId);

    const updateDto = this.validateUpdatePayload(payload);
    if (updateDto.part_number) {
      this.assertPartNumberUnique(updateDto.part_number, materialId);
    }

    const updated = this.materialRepository.update(materialId, updateDto);
    if (!updated) {
      throw new AppError(404, "Material not found");
    }

    return updated;
  }

  remove(materialId: string): void {
    this.getById(materialId);
    this.materialRepository.delete(materialId);
  }

  private validateCreatePayload(payload: Record<string, unknown>): CreateMaterialDto {
    const partNumber = requireText(payload.part_number, "part_number").toUpperCase();
    const materialName = requireText(payload.material_name, "material_name");
    const materialType = requireText(payload.material_type, "material_type");

    if (!allowedTypes.has(materialType)) {
      throw new AppError(400, "material_type is invalid");
    }

    return {
      part_number: partNumber,
      material_name: materialName,
      material_type: materialType as MaterialType,
      storage_conditions: normalizeOptionalText(
        payload.storage_conditions,
        "storage_conditions"
      ),
      specification_document: normalizeOptionalText(
        payload.specification_document,
        "specification_document"
      )
    };
  }

  private validateUpdatePayload(payload: Record<string, unknown>): UpdateMaterialDto {
    const output: UpdateMaterialDto = {};

    if (payload.part_number !== undefined) {
      output.part_number = requireText(payload.part_number, "part_number").toUpperCase();
    }

    if (payload.material_name !== undefined) {
      output.material_name = requireText(payload.material_name, "material_name");
    }

    if (payload.material_type !== undefined) {
      const materialType = requireText(payload.material_type, "material_type");
      if (!allowedTypes.has(materialType)) {
        throw new AppError(400, "material_type is invalid");
      }
      output.material_type = materialType as MaterialType;
    }

    if (payload.storage_conditions !== undefined) {
      output.storage_conditions = normalizeOptionalText(
        payload.storage_conditions,
        "storage_conditions"
      );
    }

    if (payload.specification_document !== undefined) {
      output.specification_document = normalizeOptionalText(
        payload.specification_document,
        "specification_document"
      );
    }

    if (Object.keys(output).length === 0) {
      throw new AppError(400, "No fields provided for update");
    }

    return output;
  }

  private assertPartNumberUnique(partNumber: string, ignoreMaterialId?: string): void {
    const existing = this.materialRepository.findByPartNumber(partNumber);
    if (existing && existing.material_id !== ignoreMaterialId) {
      throw new AppError(409, "part_number already exists");
    }
  }

  private generateMaterialId(): string {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `MAT-${random}`;
  }
}
