/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: kartregistrations
 * Interface for KartRegistrations
 */
export interface KartRegistrations {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  kartName?: string;
  /** @wixFieldType text */
  ownerName?: string;
  /** @wixFieldType text */
  manufacturer?: string;
  /** @wixFieldType number */
  modelYear?: number;
  /** @wixFieldType text */
  engineType?: string;
  /** @wixFieldType image */
  kartPhoto?: string;
  /** @wixFieldType text */
  contactEmail?: string;
}
