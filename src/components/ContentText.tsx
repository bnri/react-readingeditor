import { CSSProperties, forwardRef, memo, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

interface ContentTextProps {
  className?: string | undefined;
  editable: boolean;
  isOverflow?: boolean;
  style?: CSSProperties;
  contentText: string;
  onUpdateText: (text: string) => void;
}

const ContentText = forwardRef<HTMLDivElement, ContentTextProps>(
  ({ className, editable, style, contentText, isOverflow, onUpdateText }, ref) => {
    const [htmlText, setHtmlText] = useState<string>("");

    useEffect(() => {
      setHtmlText(contentText);
    }, [contentText]);

    const textClassName = useMemo(() => {
      let cn = [];
      if (!editable) {
        cn.push("no-drag");
      }
      if (className) {
        cn.push(className);
      }
      return cn.join(" ");
    }, [editable, className]);

    return (
      <>
        <StyledWarningBox className={!isOverflow ? "hide" : ""} />
        <StyledText
          className={textClassName}
          style={{ ...style }}
          ref={ref}
          suppressContentEditableWarning={editable}
          contentEditable={editable}
          dangerouslySetInnerHTML={{ __html: htmlText }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); //Prevent default browser behavior

              if (window.getSelection) {
                const selection = window.getSelection();
                if (!selection) {
                  return;
                }
                const range = selection.getRangeAt(0);
                if (!range) {
                  return;
                }

                const br = document.createElement("br");
                const textNode = document.createTextNode("\u00a0"); //Passing " " directly will not end up being shown correctly
                range.deleteContents(); //required or not?
                range.insertNode(br);
                range.collapse(false);
                range.insertNode(textNode);
                range.selectNodeContents(textNode);

                selection.removeAllRanges();
                selection.addRange(range);
                return false;
              }
            }
          }}
          onBlur={(e) => onUpdateText(e.currentTarget.innerHTML)}
        />
      </>
    );
  }
);

export default memo(ContentText);

const StyledWarningBox = styled.div`
  display: block;
  width: 746px;
  height: 746px;
  position: absolute;
  top: -3px;
  left: -3px;
  border: 3px solid red;
  &.hide {
    display: none;
  }
`;

const StyledText = styled.div`
  width: 740px;
  height: 740px;
  margin: 0 auto;
  box-sizing: border-box;
  border: 1px solid #333;
  outline: none;
  caret-color: #333;
  word-break: break-word;
  position: relative;
`;
