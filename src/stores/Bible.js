import { defineStore } from "pinia";
import Bible from "../data/BibleBooks.json";

export const useBible = defineStore("bible", {
  state: () => {
    return {
      bible: Bible,
      book: "",
      chapter: 0,
      verses: { first: 0, last: 0 },
      bibliePassages: { index: 0, passages: [] },
      passageId: 0
    };
  },
});
