import { Material, MaterialType, UpdateMaterialDto } from "./material.model";

export interface MaterialListFilter {
  q?: string;
  type?: string;
}

const now = () => new Date().toISOString();

const seedMaterials: Material[] = [
  {
    material_id: "MAT-0001",
    part_number: "PART-VC-500",
    material_name: "Ascorbic Acid (Vitamin C)",
    material_type: MaterialType.API,
    storage_conditions: "2-8C, protected from light",
    specification_document: "SPEC-API-VC-001",
    created_date: now(),
    modified_date: now()
  },
  {
    material_id: "MAT-0002",
    part_number: "PART-MCC-101",
    material_name: "Microcrystalline Cellulose",
    material_type: MaterialType.Excipient,
    storage_conditions: "Room temperature, dry area",
    specification_document: "SPEC-EXC-MCC-101",
    created_date: now(),
    modified_date: now()
  },
  {
    material_id: "MAT-0003",
    part_number: "PART-BTL-100",
    material_name: "HDPE Bottle 100cc",
    material_type: MaterialType.Container,
    storage_conditions: "Clean and dry area",
    specification_document: "SPEC-CON-HDPE-100",
    created_date: now(),
    modified_date: now()
  }
];

export class MaterialRepository {
  private readonly materials = new Map<string, Material>();

  constructor() {
    seedMaterials.forEach((material) => {
      this.materials.set(material.material_id, material);
    });
  }

  list(filter: MaterialListFilter): Material[] {
    const q = filter.q?.trim().toLowerCase();
    const type = filter.type?.trim().toLowerCase();

    return Array.from(this.materials.values()).filter((material) => {
      const matchedByType = !type || material.material_type.toLowerCase() === type;
      if (!matchedByType) {
        return false;
      }

      if (!q) {
        return true;
      }

      return (
        material.part_number.toLowerCase().includes(q) ||
        material.material_name.toLowerCase().includes(q)
      );
    });
  }

  findById(materialId: string): Material | undefined {
    return this.materials.get(materialId);
  }

  findByPartNumber(partNumber: string): Material | undefined {
    const normalized = partNumber.trim().toUpperCase();
    return Array.from(this.materials.values()).find(
      (material) => material.part_number.toUpperCase() === normalized
    );
  }

  create(material: Material): Material {
    this.materials.set(material.material_id, material);
    return material;
  }

  update(materialId: string, patch: UpdateMaterialDto): Material | undefined {
    const current = this.materials.get(materialId);
    if (!current) {
      return undefined;
    }

    const updated: Material = {
      ...current,
      ...patch,
      modified_date: now()
    };

    this.materials.set(materialId, updated);
    return updated;
  }

  delete(materialId: string): boolean {
    return this.materials.delete(materialId);
  }
}
