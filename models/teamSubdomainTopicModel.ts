import { Schema, model } from "mongoose";

interface ITeamSubDomainTopic {
  name: string;
}

const teamSubDomainTopicSchema = new Schema<ITeamSubDomainTopic>(
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

const TeamSubDomainTopic = model<ITeamSubDomainTopic>(
  "TeamSubDomainTopic",
  teamSubDomainTopicSchema
);

export default TeamSubDomainTopic;
