import { Schema, model } from "mongoose";

interface ITeamSubDomain {
  parentDomain: Schema.Types.ObjectId;
  name: string;
  commonName: string;
}

const teamSubDomainSchema = new Schema<ITeamSubDomain>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    parentDomain: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    commonName: {
      type: String,
      required: true,
      unique: true,
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
