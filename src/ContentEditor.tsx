import { CSSProperties, Dispatch, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Property } from "csstype";
import styled from "styled-components";
import { ChromePicker } from "react-color";
import ContentText from "./components/ContentText";
import AOIModal from "./components/AOIModal";

import { CustomNumberInput, CustomSelect } from "@jeongyk92/react-customform/dist/components";
import AOIViewer from "./components/AOIViewer";
import useInfoList from "./hooks/useInfoList";
import useInput from "./hooks/useInput";
import ContentQuestion from "./components/ContentQuestion";
import {
  cloneDivType,
  CommonComponents,
  ContentDeleteHandler,
  ContentSaveHandler,
  drawrectType,
  fixAoiType,
  getCSSObjType,
  ModeType,
  saveContentDataType,
  tasksType,
} from "./types";
import { StyledBtn, StyledBtnOrange, StyledBtnRed } from "./styles/Buttons";
import FontSVG from "./assets/svg/FontSVG";

interface ContentEditorProps extends CommonComponents {
  viewOnly?: boolean;
  data?: saveContentDataType;
  setLoading: Dispatch<React.SetStateAction<boolean>>;
  onClose: (goRefresh?: boolean) => void;
  onSave: ContentSaveHandler;
  onDelete: ContentDeleteHandler;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  alert,
  Swal,
  setLoading,
  data,
  onClose,
  onSave,
  onDelete,
  viewOnly,
}) => {
  const { fontList, languageList, textTypeList, textLevelList, textActiveList, textContentLevelList } = useInfoList();
  const [textTitle, setTextTitle] = useInput(data ? data.text.name : "");
  const [textLanguage, setTextLanguage] = useState(() => (data ? data.text.language : languageList[0]));
  const [textType, setTextType] = useState(() => (data ? data.text.domain : textTypeList[0]));
  const [textLevel, setTextLevel] = useState(() => (data ? data.text.level : textLevelList[0]));
  const [textActive, setTextActive] = useState(() => (data ? data.textset.textActive : textActiveList[0]));
  const [textContentLevel, setTextContentLevel] = useState(() =>
    data ? data.textset.textContentLevel : textContentLevelList[0]
  );

  // const [selectAlign] = useState<"justify" | "left" | "center" | "right">("justify");
  const selectAlign = useMemo<Property.TextAlign>(() => "justify", []);

  const [selectFont, setSelectFont] = useState<string>(() => (data ? data.text.css["font-family"] : fontList[0]));
  const [selectFontSize, setSelectFontSize] = useState<string>(() => (data ? data.text.css["font-size"] : "36px"));

  const [selectLineHeight, setSelectLineHeight] = useState<string>(() => {
    if (data && data.text.css) {
      const lineHeight = +data.text.css["line-height"].replace("px", "");
      const fontSize = +data.text.css["font-size"].replace("px", "");
      return `${((lineHeight / fontSize) * 100).toFixed(0)}%`;
    } else {
      return `120%`;
    }
  });

  const [fontWeight, setFontWeight] = useState<string>(() => (data ? data.text.css["font-weight"] : "400"));
  const [textDecoration, setTextDecoration] = useState<string>(() =>
    data ? data.text.css["text-decoration"] : "none"
  );
  const [fontStyle, setFontStyle] = useState<string>(() => (data ? data.text.css["font-style"] : "normal"));

  const [showTextcolor, setShowTextcolor] = useState(false);
  const [textcolor, setTextcolor] = useState(() => (data ? data.text.css["color"] : "#000"));
  const backcolor = useMemo(() => "#fff", []);

  const [lineCount, setLineCount] = useState<number>(() => (data ? data.text.lineCount : 0));
  const [sentenceCount, setSentenceCount] = useState<number>(() => (data ? data.text.sentenceCount : 0));
  const [wordCount, setWordCount] = useState<number>(() => (data ? data.text.wordCount : 0));
  const [charCount, setCharCount] = useState<number>(() => (data ? data.text.charCount : 0));

  const [contentText, setContentText] = useState(() =>
    // `&nbsp;?????? ????????? ????????????????????? ?????? ????????? ????????? ?????? ????????? ?????? ????????? ????????????, ?????? ??? ????????? ????????? ?????????. ????????? ?????? ????????? ?????? ???????????? ?????? ????????? ???????????????. <br/>&nbsp;???????????? ????????? ????????? 6500???????????? ?????? ????????? ???????????? ????????????, ?????? ????????? ????????? ????????? ????????????, ??????????????? ?????? ????????? ??? ????????? ????????? ?????? ???????????? ????????????. ??? ?????? ????????? ????????? ????????????. ?????? ????????? ????????? ?????? ??????, ????????? 4?????? ?????? ????????? ?????? ????????? ??????. ????????? ????????? ????????? ??????????????? ?????? ???????????? ???????????? ????????????, ??? ????????? ?????? ????????? ???????????? ????????? ?????? ????????? ????????? ????????????.`
    data ? data.text.html : `????????? ??????????????????.`
  );

  const [showCanvasAOI, setShowCanvasAOI] = useState<number>(-1);
  const [aoiMode, setAoiMode] = useState<ModeType>();

  const [fixAoi, setFixAoi] = useState<fixAoiType | undefined>();

  const [currentSelectTasksIndex, setCurrentSelectTasksIndex] = useState(0);

  const [tasks, setTasks] = useState<tasksType[]>(() => {
    if (data) {
      return data.text.tasks;
    } else {
      return [
        {
          //????????? ??????
          question: "??? ?????? ?????? ?????????????",
          options: ["?????? ?????? ??????", "?????? ???????????????", "????????????", "?????? ????????? ?????????", "?????? ?????? ?????????"],
          showText: false,
          correctOption: null,
          AOI: [],
        },
        // {
        //   //????????? ??????
        //   question: "??????????????? ?????? ??????????",
        //   options: ["????????? 6500???", "300??? ???"],
        //   showText: true,
        //   correctOption: "????????? 6500???",
        //   AOI: [
        //     {
        //       left: 0.4,
        //       top: 0.2,
        //       width: 0.436,
        //       height: 0.132,
        //       name: "?????? ???????????? ??????",
        //     },
        //     {
        //       left: 0.4,
        //       top: 0.2,
        //       width: 0.436,
        //       height: 0.132,
        //       name: "?????? ???????????? ??????2",
        //     },
        //   ],
        // },
      ];
    }
  });

  const textRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textcolorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDocumentMouseDown = (e: MouseEvent) => {
      if (showTextcolor) {
        if (!textcolorRef.current || !e.target || !textcolorRef.current.contains(e.target as Node)) {
          setShowTextcolor(false);
        }
      }
    };

    // ?????? ?????? ??? ?????????????????? mousedown?????? ???????????????
    if (showTextcolor) {
      document.addEventListener("mousedown", handleDocumentMouseDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  });

  useEffect(() => {
    if (!tasks) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const drawrect: drawrectType = (name, x, y, width, height, color) => {
      ctx.beginPath();
      //   console.log(x + '/' + y + '///' + width + '/' + height);
      ctx.strokeStyle = color; //????????????
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.font = "20px Arial";
      ctx.fillStyle = "blue";

      let textbackwidth = ctx.measureText(name).width;
      ctx.fillRect(x, y - 20, textbackwidth + 10, 22);
      ctx.fillStyle = "white";
      ctx.fillText(name, x + 5, y - 1);

      ctx.stroke();
    };

    const undraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    };

    undraw();

    const aois = tasks[currentSelectTasksIndex].AOI;

    if (showCanvasAOI !== -1 && aois.length > 0) {
      let aoi = aois[showCanvasAOI];
      drawrect(aoi.name, aoi.left * 740, aoi.top * 740, aoi.width * 740, aoi.height * 740, "#0000FF");
    } else {
      undraw();
    }
  }, [showCanvasAOI, tasks, currentSelectTasksIndex]);

  const getCssObj = useCallback<getCSSObjType>((el) => {
    const style = window.getComputedStyle(el);
    return Object.keys(style).reduce((acc, k) => {
      const name = style[+k];
      const value = style.getPropertyValue(name);
      const newobj: { [key: string]: string } = {};
      if (value !== null) {
        newobj[name] = value;
      }
      return { ...acc, ...newobj };
    }, {});
  }, []);

  const cloneDiv = useCallback<cloneDivType>((html, cssobj) => {
    let tempdiv = document.createElement("div");

    tempdiv.id = "templinecountdiv";
    tempdiv.innerHTML = html;

    for (let key in cssobj) {
      if (key !== "height" && key !== "min-height") {
        // @ts-ignore
        tempdiv.style[key] = cssobj[key];
      }
    }

    tempdiv.style.width = "740px";
    tempdiv.style.height = "auto";
    tempdiv.style.zIndex = "2000";

    return tempdiv;
  }, []);

  const onClickAutoOperation = useCallback(() => {
    if (!textRef || !textRef.current) {
      return;
    }

    let html = textRef.current.innerHTML;
    html = html.replace(/<\/div><div>/gi, "<br>");
    html = html.replace(/<div>/gi, "");
    html = html.replace(/<\/div>/gi, "");
    textRef.current.innerHTML = html;
    const text = textRef.current.textContent;

    if (!text) {
      return;
    }

    const wordcount1 = text.trim().replace(/ +/g, " ").split(" ").length + html.split("<br>").length - 1;
    // console.log(wordcount1); // 82  = 24 + 22 17 18

    //#@!

    const charcount = text
      .replace(/\s/g, "")
      .replace(/[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('??????"]/gi, "")
      .replace(/ +/gi, "").length;

    setCharCount(charcount);

    if (textLanguage === "?????????") {
      setWordCount(charcount);
    } else {
      setWordCount(wordcount1);
    }

    // var sentencecount = text.match(/[.?!](\s|$)/g) ? text.match(/[.?!](\s|$)/g).length : 0;
    const sentencecount = text.match(/[^.!?]+[.!?"]+[^".!?]|.+$/g)
      ? text.match(/[^.!?]+[.!?"]+[^".!?]|.+$/g)?.length
      : 0;
    // console.log('sc', text.match(/[^.!?]+[.!?"]+[^".!?]|.+$/g));
    setSentenceCount(sentencecount || 0);

    const cssobj = getCssObj(textRef.current);
    const $tmpDiv = cloneDiv(html, cssobj);

    document.body.append($tmpDiv);

    const divHeight = $tmpDiv.offsetHeight;
    const lineheight = +$tmpDiv.style.lineHeight.replace("px", "");

    const linecount = +(divHeight / lineheight).toFixed(0);
    setLineCount(linecount);

    document.body.removeChild($tmpDiv);

    setContentText(html);
  }, [textLanguage, getCssObj, cloneDiv]);

  const textStyle = useMemo<CSSProperties>(
    () => ({
      fontSize: selectFontSize,
      lineHeight: selectLineHeight,
      fontFamily: selectFont,
      color: textcolor,
      backgroundColor: backcolor,
      textAlign: selectAlign,
      fontWeight: fontWeight,
      textDecoration: textDecoration,
      fontStyle: fontStyle,
    }),
    [
      selectFontSize,
      selectLineHeight,
      selectFont,
      textcolor,
      backcolor,
      selectAlign,
      fontWeight,
      textDecoration,
      fontStyle,
    ]
  );

  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    if (!textRef || !textRef.current || !textStyle || !contentText || !alert) {
      return;
    }
    let html = textRef.current.innerHTML;

    const cssobj = { ...getCssObj(textRef.current), ...textStyle };
    const cloneDivEl = cloneDiv(html, cssobj);

    document.body.append(cloneDivEl);

    const divHeight = cloneDivEl.offsetHeight;

    document.body.removeChild(cloneDivEl);

    if (divHeight > 745) {
      alert.error("???????????? ????????? ????????? ??????????????????.");
    }

    setIsOverflow(divHeight > 745);
  }, [getCssObj, cloneDiv, textStyle, contentText, alert]);

  const infoItemCustomSelectDivStyle: CSSProperties = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "60%",
      height: "100%",
    }),
    []
  );

  return (
    <StyledEditor>
      <StyledContent>
        <StyledTitle className="no-drag">
          <span>??????</span>
          <input type="text" placeholder="????????? ??????????????????." value={textTitle} onChange={setTextTitle} />
        </StyledTitle>

        <StyledTextWrap>
          <AOIViewer ref={canvasRef} showCanvasAOI={showCanvasAOI} />

          <ContentText
            style={{ ...textStyle, border: isOverflow ? "none" : "1px solid #333" }}
            ref={textRef}
            isOverflow={isOverflow}
            editable={viewOnly ? false : true}
            contentText={contentText}
            onUpdateText={(html) => setContentText(html)}
          />

          {aoiMode === "add" || (aoiMode === "fix" && fixAoi) ? (
            <AOIModal
              onClose={() => {
                setAoiMode(undefined);
              }}
              onSaveAoi={(aoi) => {
                if (!tasks) {
                  return;
                }
                const aois = tasks[currentSelectTasksIndex].AOI;
                const findAoi = aois.find((a, i) => a.name === aoi.name && i !== fixAoi?.index);

                if (findAoi) {
                  alert.error("?????? ??????");
                  return;
                }

                if (aoiMode === "add") {
                  setTasks((state) =>
                    state.map((task, idx) =>
                      idx === currentSelectTasksIndex
                        ? {
                            ...task,
                            AOI: [...task.AOI, aoi],
                          }
                        : task
                    )
                  );
                } else if (aoiMode === "fix" && fixAoi) {
                  setTasks((state) =>
                    state.map((task, idx) =>
                      idx === currentSelectTasksIndex
                        ? {
                            ...task,
                            AOI: task.AOI.map((a, i) => (i === fixAoi.index ? aoi : a)),
                          }
                        : task
                    )
                  );
                } else {
                  alert.error("?????? ??????");
                  return;
                }
                setAoiMode(undefined);
                setFixAoi(undefined);
              }}
              AOIModalType={aoiMode}
              AOIdata={fixAoi?.aoi}
            />
          ) : (
            <></>
          )}
        </StyledTextWrap>
      </StyledContent>
      <StyledFormat className="no-drag">
        <StyledFormatRow>
          <CustomSelect
            divStyle={{ fontFamily: selectFont, fontSize: "0.9rem" }}
            selectItem={selectFont}
            selectList={fontList}
            onSelectItem={(sel) => setSelectFont(sel)}
          />
        </StyledFormatRow>
        <StyledFormatRow>
          <StyledToolbarItem>
            <CustomNumberInput
              value={selectFontSize}
              unit="px"
              min={24}
              max={60}
              onUpdateValue={(val) => setSelectFontSize(`${val}px`)}
            />
          </StyledToolbarItem>
        </StyledFormatRow>
        <StyledFormatRow>
          <StyledToolbarItem>
            <CustomNumberInput
              value={selectLineHeight}
              unit="%"
              min={100}
              max={200}
              step={5}
              onUpdateValue={(val) => setSelectLineHeight(`${(+val / 100).toFixed(2)}`)}
            />
          </StyledToolbarItem>
        </StyledFormatRow>
        <StyledFormatRow>
          <StyledToolbarIcon
            style={{ width: "25%" }}
            className={fontWeight === "700" ? "active" : ""}
            onClick={() => setFontWeight((state) => (state === "700" ? "400" : "700"))}
          >
            <FontSVG type="bold" currentColor={fontWeight === "700" ? "#7367f0" : undefined} />
          </StyledToolbarIcon>
          <StyledToolbarIcon
            style={{ width: "25%" }}
            className={textDecoration === "underline" ? "active" : ""}
            onClick={() => setTextDecoration((state) => (state === "underline" ? "none" : "underline"))}
          >
            <FontSVG type="underline" currentColor={textDecoration === "underline" ? "#7367f0" : undefined} />
          </StyledToolbarIcon>
          <StyledToolbarIcon
            style={{ width: "25%" }}
            className={fontStyle === "italic" ? "active" : ""}
            onClick={() => setFontStyle((state) => (state === "italic" ? "normal" : "italic"))}
          >
            <FontSVG type="italic" currentColor={fontStyle === "italic" ? "#7367f0" : undefined} />
          </StyledToolbarIcon>

          <StyledToolbarIcon style={{ width: "25%" }} ref={textcolorRef}>
            <StyledTextColor onClick={() => setShowTextcolor((state) => !state)}>
              <FontSVG type="font" />
              <StyledColorBox style={{ background: textcolor }}></StyledColorBox>
            </StyledTextColor>
            <StyledColorPicker className={showTextcolor ? "open" : ""}>
              <ChromePicker
                disableAlpha={true}
                color={textcolor}
                onChange={(color) => setTextcolor(color.hex)}
                onChangeComplete={(color) => setTextcolor(color.hex)}
              />
            </StyledColorPicker>
          </StyledToolbarIcon>
        </StyledFormatRow>
        <StyledFormatRow>
          <StyledToolbarIcon
            style={{ width: "100%" }}
            onClick={() => {
              const text = textRef.current?.textContent || "";
              setContentText(text);
            }}
          >
            <StyledToolbarItem>????????? ??????</StyledToolbarItem>
          </StyledToolbarIcon>
        </StyledFormatRow>
      </StyledFormat>
      <StyledQuestionWrap className="no-drag">
        <ContentQuestion
          alert={alert}
          taskList={tasks}
          Swal={Swal}
          viewOnly={viewOnly}
          isOverflow={isOverflow}
          onUpdateTasks={(t) => setTasks(t)}
          onUpdateCanvasAOIIndex={(idx) => setShowCanvasAOI(idx)}
          onUpdateSelectQuestionIndex={(idx) => setCurrentSelectTasksIndex(idx)}
          onUpdateAOIMode={(mode, target) => {
            if (mode === "add") {
              setAoiMode("add");
            } else {
              if (!target) {
                return;
              }
              setAoiMode("fix");
              setFixAoi(target);
            }
          }}
        />
      </StyledQuestionWrap>
      <StyledInformation className="no-drag">
        <StyledInfoItem>
          <StyledInfoLabel>??????</StyledInfoLabel>
          <CustomSelect
            divStyle={infoItemCustomSelectDivStyle}
            selectItem={textLanguage}
            selectList={languageList}
            onSelectItem={(sel) => setTextLanguage(sel)}
            textAlign="center"
          />
        </StyledInfoItem>
        <StyledInfoItem>
          <StyledInfoLabel>??????</StyledInfoLabel>
          <CustomSelect
            divStyle={infoItemCustomSelectDivStyle}
            selectItem={textType}
            selectList={textTypeList}
            onSelectItem={(sel) => setTextType(sel)}
            textAlign="center"
          />
        </StyledInfoItem>
        <StyledInfoItem>
          <StyledInfoLabel>??????</StyledInfoLabel>
          <CustomSelect
            divStyle={infoItemCustomSelectDivStyle}
            selectItem={textLevel}
            selectList={textLevelList}
            onSelectItem={(sel) => setTextLevel(sel)}
            textAlign="center"
          />
        </StyledInfoItem>
        <StyledInfoItem>
          <StyledInfoLabel>??? ???</StyledInfoLabel>
          <StyledInputWrap>
            <input
              className={!lineCount || lineCount === 0 ? "zero" : ""}
              type="number"
              min="0"
              max="99"
              value={lineCount}
              onChange={(e) => setLineCount(+e.target.value)}
            />
          </StyledInputWrap>
        </StyledInfoItem>
        <StyledInfoItem>
          <StyledInfoLabel>?????? ???</StyledInfoLabel>
          <StyledInputWrap>
            <input
              className={!sentenceCount || sentenceCount === 0 ? "zero" : ""}
              type="number"
              min="0"
              max="99"
              value={sentenceCount}
              onChange={(e) => setSentenceCount(+e.target.value)}
            />
          </StyledInputWrap>
        </StyledInfoItem>
        <StyledInfoItem>
          <StyledInfoLabel>?????? ???</StyledInfoLabel>
          <StyledInputWrap>
            <input
              className={!wordCount || wordCount === 0 ? "zero" : ""}
              type="number"
              min="0"
              max="99"
              value={wordCount}
              onChange={(e) => setWordCount(+e.target.value)}
            />
          </StyledInputWrap>
        </StyledInfoItem>
        <StyledInfoItem>
          <StyledInfoLabel>?????? ???</StyledInfoLabel>
          <StyledInputWrap>
            <input
              className={!charCount || charCount === 0 ? "zero" : ""}
              type="number"
              min="0"
              max="99"
              value={charCount}
              onChange={(e) => setCharCount(+e.target.value)}
            />
          </StyledInputWrap>
        </StyledInfoItem>
        <StyledInfoItem>
          <StyledAutoOperatorBtn onClick={() => onClickAutoOperation()}>?????? ??? ????????????</StyledAutoOperatorBtn>
        </StyledInfoItem>
        <StyledInfoItem>
          <StyledInfoLabel>?????????</StyledInfoLabel>
          <span style={{ width: "65%", textAlign: "center" }}>jeong</span>
        </StyledInfoItem>
        <StyledInfoItem>
          <StyledInfoLabel>?????????</StyledInfoLabel>
          <CustomSelect
            divStyle={infoItemCustomSelectDivStyle}
            selectItem={textActive}
            selectList={textActiveList}
            onSelectItem={(sel) => setTextActive(sel)}
            textAlign="center"
          />
        </StyledInfoItem>
        <StyledInfoItem>
          <StyledInfoLabel>?????? ??????</StyledInfoLabel>
          <CustomSelect
            divStyle={infoItemCustomSelectDivStyle}
            selectItem={textContentLevel}
            selectList={textContentLevelList}
            onSelectItem={(sel) => setTextContentLevel(sel)}
            textAlign="center"
          />
        </StyledInfoItem>
        <StyledResult style={{ height: viewOnly ? 60 : data ? 160 : 110 }}>
          {!viewOnly && (
            <StyledBtn
              onClick={() => {
                try {
                  if (!textRef.current) {
                    throw new Error("??? ????????? ????????? ??? ????????????.");
                  }

                  const html = textRef.current.innerHTML;
                  const css = getCssObj(textRef.current);

                  if (textTitle === "") {
                    throw new Error("??? ????????? ??????????????????.");
                  }

                  if (html === "" || html === `????????? ??????????????????.`) {
                    throw new Error("??? ????????? ??????????????????.");
                  }

                  if (isOverflow) {
                    throw new Error("??? ????????? ?????? ????????? ???????????? ????????????.");
                  }

                  if (lineCount === 0 || wordCount === 0 || sentenceCount === 0 || charCount === 0) {
                    throw new Error("???, ??????, ??????, ?????? ?????? ??????????????????.");
                  }

                  for (let i = 1; i < tasks.length; i++) {
                    if (tasks[i].options.length === 0) {
                      throw new Error(`${i + 1}??? ?????? ????????? ??????????????????.`);
                    }
                    if (!tasks[i].correctOption) {
                      throw new Error(`${i + 1}??? ?????? ????????? ??????????????????.`);
                    }
                  }

                  const saveObject: saveContentDataType = {
                    text: {
                      editor_version: "2.0.0",
                      name: textTitle,
                      language: textLanguage,
                      level: textLevel,
                      level_changed: textLevel,
                      domain: textType,
                      wordCount: wordCount,
                      lineCount: lineCount,
                      sentenceCount: sentenceCount,
                      charCount: charCount,
                      tasks: tasks,
                      html: html,
                      css: { ...css, border: "none" },
                    },
                    textset: {
                      textActive: textActive,
                      textContentLevel: textContentLevel,
                    },
                  };

                  if (!data) {
                    // add
                    setLoading(true);
                    onSave("add", saveObject).then((res) => {
                      if (res.valid) {
                        alert.success("?????? ??????");
                        onClose(true);
                      } else {
                        alert.error("?????? ??????");
                        console.error(res.msg);
                      }
                    });
                  } else {
                    // fix
                    setLoading(true);
                    onSave("fix", saveObject).then((res) => {
                      if (res.valid) {
                        alert.success("?????? ??????");
                        onClose(true);
                      } else {
                        alert.error("?????? ??????");
                        console.error(res.msg);
                      }
                    });
                  }
                } catch (err) {
                  if (err instanceof Error) {
                    alert.error(err.message);
                  }
                }
              }}
            >
              ??????
            </StyledBtn>
          )}
          <StyledBtn onClick={() => onClose()}>??????</StyledBtn>
          {!viewOnly && data && (
            <StyledBtnRed
              onClick={() => {
                Swal.fire({
                  icon: "warning",
                  html: <p>?????? ?????????????????????????</p>,
                  showCancelButton: true,
                  confirmButtonText: "??????",
                  cancelButtonText: "??????",
                }).then((res) => {
                  if (res.isConfirmed) {
                    setLoading(true);
                    onDelete()
                      .then((res) => {
                        if (res.valid) {
                          alert.success("?????? ??????");
                          onClose(true);
                        } else {
                          alert.error("?????? ??????");
                          console.error(res.msg);
                        }
                      })
                      .catch((err) => {
                        if (err instanceof Error) {
                          alert.error(err.message);
                        }
                      })
                      .finally(() => setLoading(false));
                  }
                });
              }}
            >
              ??? ??????
            </StyledBtnRed>
          )}
        </StyledResult>
      </StyledInformation>
    </StyledEditor>
  );
};

export default ContentEditor;

const StyledEditor = styled.div`
  width: 100%;
  max-width: 1565px;
  height: 802px; // ????????? padding 10??? + ????????? 50 + ????????? 742

  display: flex;

  margin: 0 auto;

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-size: 100%;
    vertical-align: baseline;
  }
`;

const StyledContent = styled.div`
  width: 760px; // ???????????? 740 x 740 + ?????? padding
  min-width: 760px;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const StyledTitle = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  span {
    width: 10%;
    text-align: center;
  }
  input {
    width: 90%;
    height: 70%;
    padding: 0 5px;
    outline: none;
    font-size: 20px;
  }
`;

const StyledTextWrap = styled.div`
  position: relative;
  width: 740px;
  height: 740px;
  margin: 0 auto;
`;

const StyledFormat = styled.div`
  min-width: 120px;
  max-width: 120px;
  padding-top: 50px;
  padding-right: 10px;
  border: none;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

const StyledFormatRow = styled.div`
  width: 100%;
  height: 35px; // 50 - 15px
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /* gap: 10px; */
`;

const StyledToolbarItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-size: 16px;
  width: 100%;
  height: 100%;
  cursor: pointer;

  &.active {
    color: #7367f0;
  }
`;

const StyledToolbarIcon = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  border: none;

  cursor: pointer;
  height: 70%;

  &:hover {
    color: #7367f0;
  }
`;

const StyledTextColor = styled(StyledToolbarItem)`
  font-family: "Roboto Slab", serif;
  position: relative;
  height: 100%;
`;

const StyledColorBox = styled.div`
  width: 110%;
  height: 3px;
  position: absolute;
  top: 110%;
  background-color: black;
`;

const StyledColorPicker = styled.div`
  opacity: 0;
  height: 0;
  top: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  transition: 0.5s;

  &.open {
    height: auto;
    top: 150%;
    opacity: 1;
    border: 1px solid #333;
    z-index: 5;
  }
`;

const StyledQuestionWrap = styled.div`
  width: 460px;
  min-width: 460px;
  box-sizing: content-box;
`;

const StyledInformation = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 50px;
  position: relative;
`;

const StyledInfoItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  border: none;
  position: relative;
`;

const StyledInfoLabel = styled.span`
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledInputWrap = styled.div`
  width: 65%;
  display: flex;
  justify-content: center;
  align-items: center;

  input[type="number"] {
    width: 70%;
    height: 70%;
    font-size: 20px;
    text-align: center;
    outline: none;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      appearance: none;
      margin: 0;
    }

    &.zero {
      border: 2px solid rgb(255, 60, 60);
    }
  }
`;

const StyledAutoOperatorBtn = styled(StyledBtnOrange)`
  margin: 0 auto;
  width: 70%;
`;

const StyledResult = styled(StyledInfoItem)`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  width: 100%;
  height: 160px; // 150 * 3 + 10
  gap: 10px;
  position: absolute;
  bottom: 10px;
  right: 10px;
`;
