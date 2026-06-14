import { Aggregate, Query, Schema } from 'mongoose';

type NextFn = (err?: Error) => void;

export function softDeletePlugin(schema: Schema): void {
  schema.add({
    deletedAt: { type: Date, default: null, select: false },
  });
  schema.index({ deletedAt: 1 });

  function excludeDeleted(this: Query<unknown, unknown>, next: NextFn): void {
    if (this.getFilter().deletedAt === undefined) {
      void this.where({ deletedAt: null });
    }
    next();
  }

  schema.pre(
    ['find', 'findOne', 'findOneAndUpdate', 'countDocuments', 'updateOne', 'updateMany'],
    excludeDeleted,
  );

  schema.pre('aggregate', function (this: Aggregate<unknown>, next: NextFn) {
    this.pipeline().unshift({ $match: { deletedAt: null } });
    next();
  });
}
