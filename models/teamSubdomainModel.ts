import { Schema, model } from "mongoose";

interface ITeamSubDomain {
  parentDomain: Schema.Types.ObjectId;
  name: string;
}

const teamSubDomainSchema = new Schema<ITeamSubDomain>(
  {
    name: {
      type: String,
      required: true,
    },
    parentDomain: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TeamSubDomain = model<ITeamSubDomain>(
  "TeamSubDomain",
  teamSubDomainSchema
);

export default TeamSubDomain;
