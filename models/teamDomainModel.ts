import { Schema, model } from "mongoose";

interface ITeamDomain {
  name: string;
}

const teamDomainSchema = new Schema<ITeamDomain>(
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

const TeamDomain = model<ITeamDomain>("TeamDomain", teamDomainSchema);

export default TeamDomain;
