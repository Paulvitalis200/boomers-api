import { Schema, model } from "mongoose";

interface IDomainTopic {
  name: string;
}

const domainTopicSchema = new Schema<IDomainTopic>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const DomainTopic = model<IDomainTopic>("DomainTopic", domainTopicSchema);

export default DomainTopic;
