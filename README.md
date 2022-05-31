```jsx
<ContentEditor
  Swal={Swal} // Sweetalert2
  alert={alert} // react-alert
  setLoading={setLoading} // setLoading state
  data={selRowText} // saveContentDataType
  onClose={(isRefresh = false) => {
    setSelRow(undefined);
    setAddFixMode(undefined);
    if (isRefresh) {
      // refresh, 저장/수정/삭제 성공 시에 true로 넘어옴
      setIsGetContentList(false);
    }
  }}
  // ContentSaveHandler
  onSave={(type, saveObject) => {
    return new Promise((resolve, reject) => {
      console.log("saveObject", saveObject);
      if (type === "add") {
        ContentAPI.saveContent(saveObject)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else {
        // fix
        if (!selRow) {
          return reject("선택된 텍스트의 정보를 받아올 수 없습니다.");
        }
        ContentAPI.fixContent({ text_idx: selRow.text_idx, textset_idx: selRow.textset_idx }, saveObject)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      }
    });
  }}
  // ContentSaveHandler
  onDelete={() => {
    return new Promise((resolve, reject) => {
      if (!selRow) {
        return reject("선택된 텍스트의 정보를 받아올 수 없습니다.");
      }
      ContentAPI.delContent({ text_idx: selRow.text_idx, textset_idx: selRow.textset_idx })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }}
/>
```

## types

```ts
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
    css: CSSProperties;
  };
  textset: {
    textset_idx?: number;
    textActive: string;
    textContentLevel: string;
  };
}

type ContentSaveHandler = (
  type: "add" | "fix" | "delete",
  saveObject: saveContentDataType
) => Promise<BaseResponseDataType>;
```
