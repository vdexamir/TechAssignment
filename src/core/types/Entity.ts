/**
 * The shape of an Entity used to define new domain models
 */
export interface Entity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
}
