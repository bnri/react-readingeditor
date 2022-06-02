import { CSSProperties } from "react";
import { StandardLonghandPropertiesHyphen } from "csstype";
import { AlertContainer } from "react-alert";
import Swal from "sweetalert2";
import { ReactSweetAlert } from "sweetalert2-react-content";

interface CommonComponents {
  Swal: typeof Swal & ReactSweetAlert;
  alert: AlertContainer;
}

interface AOIType {
  left: number;
  top: number;
  width: number;
  height: number;
  name: string;
}

interface tasksType {
  question: string;
  options: string[];
  correctOption: string | null;
  showText: boolean;
  AOI: AOIType[];
}

interface saveContentDataType {
  text: {
    text_idx?: number;
    editor_version: string;
    name: string;
    language: string;
    level: string;
    level_changed: string;
    domain: string;
    wordCount: number;
    lineCount: number;
    sentenceCount: number;
    charCount: number;
    tasks: tasksType[];
    html: string;
    css: { [key: string]: string };
  };
  textset: {
    textset_idx?: number;
    textActive: string;
    textContentLevel: string;
  };
}

interface BaseResponseDataType {
  valid: boolean;
  msg: string;
}

type ContentSaveHandler = (
  type: "add" | "fix" | "delete",
  saveObject: saveContentDataType
) => Promise<BaseResponseDataType>;

type ContentDeleteHandler = () => Promise<BaseResponseDataType>;

type fixTaskType = { task: tasksType; index: number };

type ModeType = "add" | "fix" | undefined;
type optionType = { correctOption: string | null; options: string[] };
type fixTextType = { text: string; index: number };
type fixAoiType = { aoi: AOIType; index: number };
type drawrectType = (name: string, x: number, y: number, width: number, height: number, color: string) => void;

type getCSSObjType = (el: HTMLElement) => { [key: string]: string };
type cloneDivType = (html: string, cssobj: CSSProperties) => HTMLDivElement;
type swapTaskType = (type: "question" | "options" | "AOI", oldIdx: number, newIdx: number) => void;
