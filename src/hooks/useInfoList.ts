import { useMemo } from "react";
const useInfoList = () => {
  const fontList = useMemo(
    () => [
      "바탕",
      "굴림",
      "돋움",
      "궁서",
      "serif",
      "Sans-serif",
      "Fantasy",
      "제주명조",
      "제주고딕",
      "리디바탕",
      // "Microsoft Yahei",
      // "微软雅黑",
      // "STXihei",
      // "华文细黑",
    ],
    []
  );
  const languageList = useMemo(() => ["한국어", "영어"], []);
  const textTypeList = useMemo(() => ["문학", "인문사회", "과학기술", "기타"], []);
  const textLevelList = useMemo(() => Array.from({ length: 16 }, (_, i) => `${i + 5}`), []);
  const textLevelActiveList = useMemo(() => ["설정레벨", "변경레벨"], []);
  const textActiveList = useMemo(() => ["조직 공개", "비공개"], []);
  const textContentLevelList = useMemo(() => ["자동", "초심자", "초등 저학년", "초등 고학년", "중학생", "고등학생"], []);

  return {
    fontList,
    languageList,
    textTypeList,
    textLevelList,
    textActiveList,
    textContentLevelList,
    textLevelActiveList,
  };
};

export default useInfoList;
