import { atom } from "recoil";

export const newAlertState = atom({
  key: "alertListState",
  default: { message: "" },
});

export const alertHistoryState = atom({
  key: "alertHistoryState",
  default: [],
});
