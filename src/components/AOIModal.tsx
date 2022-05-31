import { useEffect, useRef, useState } from "react";
import styles from "./AOIModal.module.scss";
import classNames from "classnames";

const cx = classNames.bind(styles);

interface AOIModalProps {
  AOIModalType: "add" | "fix";
  task?: tasksType;
  AOIdata: AOIType | undefined;

  onClose: () => void;
  onSaveAoi: (aoi: AOIType) => void;
}

const AOIModal: React.FC<AOIModalProps> = ({ AOIModalType, AOIdata, onClose, onSaveAoi }) => {
  const [AOI, setAOI] = useState<AOIType>(() => {
    if (AOIModalType === "fix" && AOIdata) {
      return { ...AOIdata };
    } else {
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        name: "",
      };
    }
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    let mousedown = false;
    let start_x = 0;
    let start_y = 0;
    let end_x = 0;
    let end_y = 0;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const drawrect = (x: number, y: number, width: number, height: number, color: string) => {
      if (!canvas || !ctx) {
        return;
      }
      ctx.beginPath();

      //   console.log(x + '/' + y + '///' + width + '/' + height);
      ctx.strokeStyle = color; //테두리색
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      ctx.stroke();
    };
    const undraw = () => {
      if (!canvas || !ctx) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    };

    const md = (e: MouseEvent) => {
      undraw();
      mousedown = true;
      start_x = e.offsetX;
      start_y = e.offsetY;
    };
    const mu = (e: MouseEvent) => {
      if (mousedown) {
        undraw();
        mousedown = false;

        end_x = e.offsetX;
        end_y = e.offsetY;
        const left = start_x < end_x ? start_x : end_x; //left
        const top = start_y < end_y ? start_y : end_y; //top
        const width = left !== start_x ? start_x - end_x : end_x - start_x;
        const height = top !== start_y ? start_y - end_y : end_y - start_y;

        setAOI({
          ...AOI,
          left: +(left / 740).toFixed(3),
          top: +(top / 740).toFixed(3),
          width: +(width / 740).toFixed(3),
          height: +(height / 740).toFixed(3),
        });
      }
    };
    const mm = (e: MouseEvent) => {
      if (mousedown) {
        undraw();
        const tmp_x = e.offsetX;
        const tmp_y = e.offsetY;
        const width = tmp_x - start_x;
        const height = tmp_y - start_y;

        drawrect(start_x, start_y, width, height, "green");
      }
    };
    const mo = (e: MouseEvent) => {
      if (mousedown) {
        mousedown = false;
        undraw();
        end_x = e.offsetX;
        end_y = e.offsetY;
        // console.log(end_x);
        const left = start_x < end_x ? start_x : end_x; //left
        const top = start_y < end_y ? start_y : end_y; //top
        const width = left !== start_x ? start_x - end_x : end_x - start_x;
        const height = top !== start_y ? start_y - end_y : end_y - start_y;

        setAOI({
          ...AOI,
          left: +(left / 740).toFixed(3) < 0 ? 0 : +(left / 740).toFixed(3),
          top: +(top / 740).toFixed(3) < 0 ? 0 : +(top / 740).toFixed(3),
          width: +(width / 740).toFixed(3),
          height: +(height / 740).toFixed(3),
        });
      }
    };

    //console.log(AOI);
    const drawname = (x: number, y: number, width: number, height: number, color: string, name: string) => {
      if (!canvas || !ctx) {
        return;
      }

      ctx.beginPath();
      ctx.font = "20px Arial";
      ctx.fillStyle = color;

      let textbackwidth = ctx.measureText(name).width;
      ctx.fillRect(x, y - 20, textbackwidth + 10, 22);
      ctx.fillStyle = "white";
      ctx.fillText(name, x + 5, y - 1);
      ctx.stroke();
    };

    const drawmsg = (msg: string) => {
      if (!canvas || !ctx) {
        return;
      }

      ctx.beginPath();
      ctx.font = "40px Arial";
      ctx.fillStyle = "red";

      const textbackwidth = ctx.measureText(msg).width;
      let x = (740 - textbackwidth) / 2;
      x = x < 0 ? 0 : x;

      const y = 320;

      ctx.fillRect(x, y - 40, textbackwidth + 10, 44);
      ctx.fillStyle = "white";
      ctx.fillText(msg, x + 5, y - 2);
      ctx.stroke();
    };

    undraw();

    if (AOI.left > 0 && AOI.top > 0 && AOI.width > 0 && AOI.height > 0) {
      drawrect(AOI.left * 740, AOI.top * 740, AOI.width * 740, AOI.height * 740, "#0000ff");
      if (AOI.name) {
        drawname(AOI.left * 740, AOI.top * 740, AOI.width * 740, AOI.height * 740, "#0000ff", AOI.name);
      } else {
        drawname(
          AOI.left * 740,
          AOI.top * 740,
          AOI.width * 740,
          AOI.height * 740,
          "#ff0000",
          "핵심영역 이름을 정해주세요"
        );
      }
    }

    canvas.addEventListener("mousedown", md);
    canvas.addEventListener("mouseup", mu);
    canvas.addEventListener("mousemove", mm);
    canvas.addEventListener("mouseout", mo);

    return () => {
      canvas?.removeEventListener("mousedown", md);
      canvas?.removeEventListener("mouseup", mu);
      canvas?.removeEventListener("mousemove", mm);
      canvas?.removeEventListener("mouseout", mo);
    };
  }, [AOI]);

  return (
    <div className={cx(styles.AOIModal, "no-drag")}>
      <div className={styles.dark}></div>
      <div className={styles.contents}>
        <div className={styles.infoBox}>
          <div className={styles.inputWrap}>
            <input
              className={styles.inputText}
              type="text"
              value={AOI.name}
              placeholder="핵심영역 이름"
              onChange={(e) => {
                setAOI((state) => ({
                  ...state,
                  name: e.target.value,
                }));
              }}
            />
          </div>
          <div className={styles.buttons}>
            <button
              disabled={!AOI.height || !AOI.name ? true : false}
              className={cx(styles.btn)}
              onClick={() => {
                onSaveAoi(AOI);
              }}
            >
              영역 {AOIModalType === "add" ? "추가" : "수정"}
            </button>
            <button className={cx(styles.btn, styles.btn_red)} onClick={onClose} style={{ marginLeft: "10px" }}>
              취소
            </button>
          </div>
        </div>

        <div className={styles.canvasWrapper}>
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            width={740}
            height={740}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        {!(AOI.left > 0 && AOI.top > 0 && AOI.width > 0 && AOI.height > 0) && (
          <div className={styles.dragInfo}>핵심영역을 마우스로 드래그 해주세요</div>
        )}
      </div>
    </div>
  );
};

export default AOIModal;
