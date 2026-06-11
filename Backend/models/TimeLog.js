import mongoose, { Schema } from "mongoose";
const timeLogScheme = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true
        },
        site: {
            type: String,
            required: true
        },
        ms: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        timestamps: true
    }
)


timeLogScheme.index({date: 1, site: 1}, {unique: true});

const Timelog = mongoose.model("TimeLog", timeLogScheme);

export default Timelog;