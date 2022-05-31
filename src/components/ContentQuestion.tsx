import BounceCheckbox from "./bouncecheckbox/BounceCheckbox";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { memo, useCallback, useEffect, useState } from "react";
import { AOIType, CommonComponents, swapTaskType, tasksType } from "../types";

interface ContentQuestionProps extends CommonComponents {
  taskList: tasksType[];
  isOverflow?: boolean;
  onUpdateTasks: (tasks: tasksType[]) => void;
  onUpdateSelectQuestionIndex: (idx: number) => void;
  onUpdateCanvasAOIIndex: (idx: number) => void;
  onUpdateAOIMode: (mode: "add" | "fix", target?: { aoi: AOIType; index: number }) => void;
}

const ContentQuestion: React.FC<ContentQuestionProps> = ({
  alert,
  isOverflow,
  taskList,
  onUpdateTasks,
  onUpdateSelectQuestionIndex,
  onUpdateCanvasAOIIndex,
  onUpdateAOIMode,
}) => {
  const [tasks, setTasks] = useState<tasksType[]>([]);

  useEffect(() => {
    if (!taskList) {
      return;
    }

    setTasks(taskList);
  }, [taskList]);

  const [currentSelectTasksIndex, setCurrentSelectTasksIndex] = useState(0);

  // question text input state
  type fixTextType = { type: "question" | "option"; idx: number; text: string };
  const [addQuestionText, setAddQuestionText] = useState("");
  const [fixText, setFixText] = useState<fixTextType | undefined>();

  // question option text input state
  const [addOptionText, setAddOptionText] = useState("");

  const addQuestion = useCallback(() => {
    if (addQuestionText === "") {
      alert.error("비어있습니다. 추가 불가");
      return;
    }

    const findDuplicateQuestion = tasks.find((task) => task.question === addQuestionText);

    if (findDuplicateQuestion) {
      alert.error("문제가 중복됩니다. 추가 불가");
      return;
    }

    if (tasks.length >= 11) {
      alert.error("문제 생성은 최대 11문제입니다. 추가 불가");
      return;
    }

    onUpdateTasks([
      ...tasks,
      {
        question: addQuestionText,
        AOI: [],
        correctOption: null,
        showText: false,
        options: [],
      },
    ]);

    setTasks((state) => [
      ...state,
      {
        question: addQuestionText,
        AOI: [],
        correctOption: null,
        showText: false,
        options: [],
      },
    ]);

    setAddQuestionText("");
  }, [tasks, addQuestionText, alert, onUpdateTasks]);

  const addOption = useCallback(() => {
    if (addOptionText === "") {
      alert.error("비어있습니다. 추가 불가");
      return;
    }

    const options = tasks[currentSelectTasksIndex].options;

    const findDuplicateQuestion = options.find((opt) => opt === addOptionText);

    if (findDuplicateQuestion) {
      alert.error("보기가 중복됩니다. 추가 불가");
      return;
    }

    if (options.length >= 5) {
      alert.error("보기 생성은 최대 5개 입니다. 추가 불가");
      return;
    }

    onUpdateTasks(
      tasks.map((task, idx) =>
        idx === currentSelectTasksIndex ? { ...task, options: [...options, addOptionText] } : task
      )
    );

    setTasks((state) =>
      state.map((task, idx) =>
        idx === currentSelectTasksIndex ? { ...task, options: [...options, addOptionText] } : task
      )
    );

    setAddOptionText("");
  }, [alert, tasks, addOptionText, currentSelectTasksIndex, onUpdateTasks]);

  type setCorrectType = (optionIdx: number) => void;
  const setCorrect = useCallback<setCorrectType>(
    (optionIdx) => {
      const opt = tasks[currentSelectTasksIndex].options[optionIdx];

      onUpdateTasks(
        tasks.map((task, idx) =>
          idx === currentSelectTasksIndex
            ? {
                ...task,
                correctOption: task.correctOption === opt ? null : opt,
              }
            : task
        )
      );

      setTasks((state) =>
        state.map<tasksType>((task, idx) =>
          idx === currentSelectTasksIndex
            ? {
                ...task,
                correctOption: task.correctOption === opt ? null : opt,
              }
            : task
        )
      );
    },
    [tasks, currentSelectTasksIndex, onUpdateTasks]
  );

  const fixQuestionOrOption = useCallback(() => {
    if (!fixText) {
      alert.error("수정 불가");
      return;
    }

    if (fixText.text === "") {
      alert.error("비어있습니다. 수정 불가");
      return;
    }

    if (fixText.type === "question") {
      if (tasks[fixText.idx].question === fixText.text) {
        alert.error("변경 사항이 없습니다. 수정 불가");
        return;
      }

      const findDuplicateQuestion = tasks.find((task) => task.question === fixText.text);

      if (findDuplicateQuestion) {
        alert.error("문제가 중복됩니다. 수정 불가");
        return;
      }

      onUpdateTasks(
        tasks.map((task, idx) =>
          idx === fixText.idx
            ? {
                ...task,
                question: fixText.text,
              }
            : task
        )
      );

      setTasks((state) =>
        state.map<tasksType>((task, idx) =>
          idx === fixText.idx
            ? {
                ...task,
                question: fixText.text,
              }
            : task
        )
      );
    } else {
      const options = tasks[currentSelectTasksIndex].options;

      if (options[fixText.idx] === fixText.text) {
        alert.error("변경 사항이 없습니다. 수정 불가");
        return;
      }

      const findDuplicateQuestion = options.find((opt) => opt === fixText.text);

      if (findDuplicateQuestion) {
        alert.error("보기가 중복됩니다. 추가 불가");
        return;
      }

      onUpdateTasks(
        tasks.map((task, idx) =>
          idx === currentSelectTasksIndex
            ? {
                ...task,
                correctOption: fixText.text === task.correctOption ? null : task.correctOption,
                options: task.options.map((opt, idx) => (idx === fixText.idx ? fixText.text : opt)),
              }
            : task
        )
      );

      setTasks((state) =>
        state.map<tasksType>((task, idx) =>
          idx === currentSelectTasksIndex
            ? {
                ...task,
                correctOption: fixText.text === task.correctOption ? null : task.correctOption,
                options: task.options.map((opt, idx) => (idx === fixText.idx ? fixText.text : opt)),
              }
            : task
        )
      );
    }
    setFixText(undefined);
  }, [alert, tasks, fixText, currentSelectTasksIndex, onUpdateTasks]);

  const swapTask = useCallback<swapTaskType>(
    (type, oldIdx, newIdx) => {
      if (!tasks) {
        return;
      }

      const newTasks: tasksType[] = JSON.parse(JSON.stringify(tasks));

      if (type === "question") {
        const tmpTask = newTasks[oldIdx];
        newTasks[oldIdx] = newTasks[newIdx];
        newTasks[newIdx] = tmpTask;
      } else if (type === "options" || type === "AOI") {
        const selectTask = newTasks[currentSelectTasksIndex];
        const tmp = selectTask[type][oldIdx];
        selectTask[type][oldIdx] = selectTask[type][newIdx];
        selectTask[type][newIdx] = tmp;
      }

      onUpdateTasks(newTasks);

      setTasks(newTasks);
    },
    [tasks, currentSelectTasksIndex, onUpdateTasks]
  );

  const invertShowText = useCallback(() => {
    if (currentSelectTasksIndex === 0) {
      alert.error("1번 문제는 수정할 수 없습니다.");
      return;
    }

    const task = tasks[currentSelectTasksIndex];
    const showText = task.showText;
    console.log("task", task);

    if (task.AOI.length > 0 && showText) {
      alert.error("핵심영역 내용이 있다면 반드시 공개해야 합니다.");
      return;
    }

    onUpdateTasks(
      tasks.map((task, idx) =>
        idx === currentSelectTasksIndex
          ? {
              ...task,
              showText: !showText,
            }
          : task
      )
    );

    setTasks((state) =>
      state.map<tasksType>((task, idx) =>
        idx === currentSelectTasksIndex
          ? {
              ...task,
              showText: !showText,
            }
          : task
      )
    );
  }, [alert, tasks, currentSelectTasksIndex, onUpdateTasks]);

  const deleteQuestion = useCallback(
    (idx: number) => {
      onUpdateTasks(tasks.filter((_, i) => i !== idx));
      setTasks((state) => state.filter((_, i) => i !== idx));
      setCurrentSelectTasksIndex(0);
      onUpdateSelectQuestionIndex(0);
    },
    [tasks, onUpdateSelectQuestionIndex, onUpdateTasks]
  );

  if (tasks.length > 0) {
    return (
      <>
        <StyledQuestion>
          <StyledQuestionTitle>
            문제 항목&nbsp;<span style={{ fontSize: "0.8rem" }}>(최대 11개)</span>
          </StyledQuestionTitle>
          <DragDropContext
            onDragEnd={(e) => {
              if (!e.destination) {
                return;
              }

              if (e.destination.index === 0) {
                alert.error("1번 문제로 이동 할 수 없습니다.");
              } else if (e.destination.index >= tasks.length) {
                swapTask("question", e.source.index, tasks.length - 1);
              } else {
                swapTask("question", e.source.index, e.destination.index);
              }
            }}
          >
            <Droppable droppableId="question">
              {(provided) => (
                <StyledQuestionList {...provided.droppableProps} ref={provided.innerRef}>
                  {tasks.map((task, idx) => {
                    const isFixThis = fixText && fixText.type === "question" && fixText.idx === idx ? true : false;
                    return (
                      <Draggable key={`task_${idx}`} draggableId={`task_${idx}`} index={idx} isDragDisabled={idx === 0}>
                        {(provided, snapshot) => {
                          let cn = [];
                          if (currentSelectTasksIndex === idx) {
                            cn.push("active");
                          }
                          if (snapshot.isDragging) {
                            cn.push("dragging");
                          }

                          return (
                            <li
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              className={cn.join(" ")}
                              onClick={() => {
                                if (idx !== currentSelectTasksIndex) {
                                  setCurrentSelectTasksIndex(idx);
                                  onUpdateSelectQuestionIndex(idx);
                                }
                              }}
                              onDoubleClick={() => {
                                if (idx === 0) {
                                  alert.error("1번 문제는 수정할 수 없습니다.");
                                  return;
                                }
                                setFixText({
                                  idx,
                                  type: "question",
                                  text: task.question,
                                });
                              }}
                            >
                              <span style={{ marginRight: 5 }}>{idx + 1}.</span>
                              <input
                                className={isFixThis ? "edit" : ""}
                                type="text"
                                value={isFixThis ? fixText?.text : task.question}
                                disabled={!isFixThis}
                                ref={(input) => {
                                  if (isFixThis) {
                                    input?.focus();
                                  }
                                }}
                                onChange={(e) => {
                                  if (isFixThis && fixText) {
                                    setFixText({ ...fixText, text: e.target.value });
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Escape") {
                                    setFixText(undefined);
                                  } else if (e.key === "Enter") {
                                    fixQuestionOrOption();
                                  }
                                }}
                                onBlur={() => {
                                  setFixText(undefined);
                                }}
                              />
                              {idx !== 0 && !isFixThis && (
                                <div className="editWrap">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFixText({
                                        idx,
                                        type: "question",
                                        text: task.question,
                                      });
                                    }}
                                  >
                                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteQuestion(idx);
                                    }}
                                  >
                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                  </button>
                                </div>
                              )}
                            </li>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {tasks.length < 11 && (
                    <Draggable key={`task_add`} draggableId={`task_add`} index={tasks.length} isDragDisabled={true}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          className="addItem"
                        >
                          <span style={{ marginRight: 5 }}>{tasks.length + 1}.</span>
                          <input
                            className="edit"
                            type="text"
                            value={addQuestionText}
                            onChange={(e) => setAddQuestionText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addQuestion();
                              }
                            }}
                          />
                          <i
                            className="fa fa-plus"
                            aria-hidden="true"
                            onClick={() => {
                              addQuestion();
                            }}
                          ></i>
                        </li>
                      )}
                    </Draggable>
                  )}
                  {provided.placeholder}
                </StyledQuestionList>
              )}
            </Droppable>
          </DragDropContext>
        </StyledQuestion>
        <StyledOptionWrap>
          <StyledOptions>
            <StyledQuestionTitle>
              보기 항목&nbsp;<span style={{ fontSize: "0.8rem" }}>(최대 5개)</span>
            </StyledQuestionTitle>
            <StyledOpenText>
              <BounceCheckbox checked={tasks[currentSelectTasksIndex].showText} onChange={() => invertShowText()} />
              문제 풀 때 지문 공개
            </StyledOpenText>
            <DragDropContext
              onDragEnd={(e) => {
                if (!e.destination) {
                  return;
                }

                if (e.destination.index >= tasks.length) {
                  swapTask("options", e.source.index, tasks[currentSelectTasksIndex].options.length - 1);
                } else {
                  swapTask("options", e.source.index, e.destination.index);
                }
              }}
            >
              <Droppable droppableId="option">
                {(provided) => (
                  <StyledOptionList {...provided.droppableProps} ref={provided.innerRef}>
                    {tasks[currentSelectTasksIndex].options.map((opt, idx) => {
                      const currentTask = tasks[currentSelectTasksIndex];
                      const isFixThis = fixText && fixText.type === "option" && fixText.idx === idx ? true : false;

                      return (
                        <Draggable
                          key={`opt_${idx}`}
                          draggableId={`opt_${idx}`}
                          index={idx}
                          isDragDisabled={currentSelectTasksIndex === 0}
                        >
                          {(provided, snapshot) => {
                            const cn = [];
                            if (opt === currentTask.correctOption) {
                              cn.push("correct");
                            }
                            if (snapshot.isDragging) {
                              cn.push("dragging");
                            }
                            return (
                              <li
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                                key={`opt_${idx}`}
                                className={cn.join(" ")}
                                onDoubleClick={() => {
                                  if (currentSelectTasksIndex === 0) {
                                    alert.error("1번 문제는 수정할 수 없습니다.");
                                    return;
                                  }
                                  setFixText({
                                    idx,
                                    type: "option",
                                    text: opt,
                                  });
                                }}
                              >
                                <span style={{ marginRight: 5 }}>{idx + 1}.</span>
                                <input
                                  className={isFixThis ? "edit" : ""}
                                  type="text"
                                  value={isFixThis ? fixText?.text : opt}
                                  disabled={!isFixThis}
                                  ref={(input) => {
                                    if (isFixThis) {
                                      input?.focus();
                                    }
                                  }}
                                  onChange={(e) => {
                                    if (isFixThis && fixText) {
                                      setFixText({ ...fixText, text: e.target.value });
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                      setFixText(undefined);
                                    } else if (e.key === "Enter") {
                                      fixQuestionOrOption();
                                    }
                                  }}
                                  onBlur={() => {
                                    setFixText(undefined);
                                  }}
                                />
                                {currentSelectTasksIndex !== 0 && !isFixThis && (
                                  <div className="editWrap">
                                    <button
                                      title="정답 체크"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCorrect(idx);
                                      }}
                                    >
                                      <i className="fa fa-check-square-o" aria-hidden="true"></i>
                                    </button>
                                    <button
                                      title="수정"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setFixText({
                                          idx,
                                          type: "option",
                                          text: opt,
                                        });
                                      }}
                                    >
                                      <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                                    </button>
                                    <button
                                      title="삭제"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onUpdateTasks(
                                          tasks.map((task, idx) =>
                                            idx === currentSelectTasksIndex
                                              ? {
                                                  ...task,
                                                  correctOption:
                                                    task.options[idx] === task.correctOption
                                                      ? null
                                                      : task.correctOption,
                                                  options: task.options.filter((o) => o !== opt),
                                                }
                                              : task
                                          )
                                        );
                                        setTasks((state) =>
                                          state.map((task, idx) =>
                                            idx === currentSelectTasksIndex
                                              ? {
                                                  ...task,
                                                  correctOption:
                                                    task.options[idx] === task.correctOption
                                                      ? null
                                                      : task.correctOption,
                                                  options: task.options.filter((o) => o !== opt),
                                                }
                                              : task
                                          )
                                        );
                                      }}
                                    >
                                      <i className="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                  </div>
                                )}
                              </li>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                    {tasks[currentSelectTasksIndex].options.length < 5 && (
                      <Draggable
                        key={`opt_add`}
                        draggableId={`opt_add`}
                        index={tasks[currentSelectTasksIndex].options.length}
                        isDragDisabled={true}
                      >
                        {(provided) => (
                          <li
                            className="addItem"
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                          >
                            <span style={{ marginRight: 5 }}>{tasks[currentSelectTasksIndex].options.length + 1}.</span>
                            <input
                              className="edit"
                              type="text"
                              value={addOptionText}
                              onChange={(e) => setAddOptionText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  addOption();
                                }
                              }}
                            />
                            <i className="fa fa-plus" aria-hidden="true" onClick={() => addOption()}></i>
                          </li>
                        )}
                      </Draggable>
                    )}
                    {provided.placeholder}
                  </StyledOptionList>
                )}
              </Droppable>
            </DragDropContext>
          </StyledOptions>
          <StyledAOI>
            <StyledQuestionTitle>
              핵심영역&nbsp;<span style={{ fontSize: "0.8rem" }}>(최대 3개)</span>
            </StyledQuestionTitle>
            <DragDropContext
              onDragEnd={(e) => {
                if (!e.destination) {
                  return;
                }

                swapTask("AOI", e.source.index, e.destination.index);
              }}
            >
              <Droppable droppableId="AOI">
                {(provided) => (
                  <StyledAOIList {...provided.droppableProps} ref={provided.innerRef}>
                    {tasks[currentSelectTasksIndex].AOI.map((aoi, idx) => (
                      <Draggable key={`aoi_${idx}`} draggableId={`aoi_${idx}`} index={idx}>
                        {(provided, snapshot) => {
                          const cn = [];
                          if (snapshot.isDragging) {
                            cn.push("dragging");
                          }
                          return (
                            <li
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              key={`aoi_${idx}`}
                              className={cn.join(" ")}
                              onMouseEnter={() => onUpdateCanvasAOIIndex(idx)}
                              onMouseLeave={() => onUpdateCanvasAOIIndex(-1)}
                            >
                              <span>
                                {idx + 1}. {aoi.name}
                              </span>
                              {currentSelectTasksIndex !== 0 && (
                                <div className="editWrap">
                                  <button
                                    title="수정"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onUpdateAOIMode("fix", {
                                        aoi: { ...aoi },
                                        index: idx,
                                      });
                                    }}
                                  >
                                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                                  </button>
                                  <button
                                    title="삭제"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onUpdateTasks(
                                        tasks.map((task, taskIndex) =>
                                          taskIndex === currentSelectTasksIndex
                                            ? {
                                                ...task,
                                                AOI: task.AOI.filter((_, i) => i !== idx),
                                              }
                                            : task
                                        )
                                      );
                                      setTasks((state) =>
                                        state.map((task, taskIndex) =>
                                          taskIndex === currentSelectTasksIndex
                                            ? {
                                                ...task,
                                                AOI: task.AOI.filter((_, i) => i !== idx),
                                              }
                                            : task
                                        )
                                      );
                                      onUpdateCanvasAOIIndex(-1);
                                    }}
                                  >
                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                  </button>
                                </div>
                              )}
                            </li>
                          );
                        }}
                      </Draggable>
                    ))}
                    {currentSelectTasksIndex !== 0 && tasks[currentSelectTasksIndex].AOI.length < 3 && (
                      <Draggable
                        key={`aoi_add`}
                        draggableId={`aoi_add`}
                        index={tasks[currentSelectTasksIndex].AOI.length}
                        isDragDisabled={true}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            className="addRange"
                            title="영역 추가"
                            onClick={() => {
                              if (!tasks) {
                                alert.error("추가 불가");
                                return;
                              }
                              if (!tasks[currentSelectTasksIndex].showText) {
                                alert.error("지문 공개를 먼저 해주세요.");
                                return;
                              }
                              if (isOverflow) {
                                alert.error("텍스트를 영역 안으로 조절한 후 시도해주세요.");
                                return;
                              }
                              if (tasks[currentSelectTasksIndex].AOI.length >= 3) {
                                alert.error("3개까지 추가 가능");
                                return;
                              }
                              onUpdateAOIMode("add");
                            }}
                          >
                            <i className="fa fa-plus" aria-hidden="true"></i>
                          </li>
                        )}
                      </Draggable>
                    )}
                    {provided.placeholder}
                  </StyledAOIList>
                )}
              </Droppable>
            </DragDropContext>
          </StyledAOI>
        </StyledOptionWrap>
      </>
    );
  } else {
    return <></>;
  }
};

export default memo(ContentQuestion);

const StyledQuestion = styled.div``;
const StyledQuestionTitle = styled.h2`
  height: 50px;
  padding-left: 10px;
  display: flex;
  align-items: center;
  font-weight: 700;
`;
const StyledQuestionCommonList = styled.ul`
  border: 1px solid #333;
  overflow: hidden auto;
  background-color: #f0f0f0;
  li {
    width: 100%;
    padding-left: 5px;
    height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    position: relative;

    &:not(.addItem):hover {
      background-color: #7367f0;
      color: #fff;

      input {
        background-color: #7367f0;
        color: #fff;

        &.edit {
          height: 80%;
          background-color: #fff;
          border: 1px solid #333;
          cursor: text;
          color: #333;
        }
      }

      .editWrap {
        opacity: 1;
      }
    }

    &.active {
      background-color: #7367f0;
      color: #fff;

      input {
        background-color: #7367f0;
        color: #fff;

        &.edit {
          height: 80%;
          background-color: #fff;
          border: 1px solid #333;
          cursor: text;
          color: #333;
        }
      }
    }

    &.dragging {
      background: #8d83ff;
      color: #fff;
      input {
        background-color: #8d83ff;
        color: #fff;
      }
    }

    &.addItem i {
      margin: 0 5px;
      font-size: 24px;
    }

    &.correct {
      border: 2px solid #28a745;
    }

    &.addRange {
      justify-content: center;
    }

    input {
      flex: 1;
      height: 100%;
      border: none;
      outline: none;
      background-color: transparent;
      font-size: 16px;
      box-sizing: border-box;

      cursor: pointer;

      /* 줄임표 설정하기 */
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
      overflow: hidden;

      &:disabled {
        pointer-events: none;
      }

      &.edit {
        height: 80%;
        background-color: #fff;
        border: 1px solid #333;
        cursor: text;
        color: #333;
      }
    }

    .editWrap {
      opacity: 0;
      margin-right: 5px;
      display: flex;
      gap: 5px;
      transition: 0.2s;
      button {
        cursor: pointer;
        border: none;
        outline: none;
        background-color: transparent;
        &:hover {
          color: #fff;
        }
        i {
          font-size: 20px;
        }
      }
    }
  }
`;

const StyledQuestionList = styled(StyledQuestionCommonList)`
  min-height: 316px;
  max-height: 316px;
`;
const StyledOptionList = styled(StyledQuestionCommonList)`
  min-height: 177px;
  max-height: 177px;
`;
const StyledAOIList = styled(StyledQuestionCommonList)`
  min-height: 107px;
  max-height: 107px;
`;

const StyledOptionWrap = styled.div``;
const StyledOptions = styled.div``;
const StyledOpenText = styled.div`
  padding-left: 10px;
  display: flex;
  gap: 5px;
  height: 40px;
`;

const StyledAOI = styled.div``;
