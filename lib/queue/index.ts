import { Queue } from "bullmq";
import redis from "../redis";

const connection = redis;

export const bidQueue = new Queue("bid-processing", { connection });
export const notificationQueue = new Queue("notifications", { connection });
export const moderationQueue = new Queue("moderation", { connection });
export const snapshotQueue = new Queue("board-snapshots", { connection });
