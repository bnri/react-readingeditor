import { forwardRef, memo } from "react";
import styled from "styled-components";

interface AOIViewerProps {
  showCanvasAOI: number;
}

const AOIViewer = forwardRef<HTMLCanvasElement, AOIViewerProps>(({ showCanvasAOI }, ref) => {
  return (
    <StyledCanvasWrap
      style={{
        visibility: showCanvasAOI !== -1 ? "visible" : "hidden",
      }}
    >
      <canvas ref={ref} width={740} height={740} />
    </StyledCanvasWrap>
  );
});

export default memo(AOIViewer);

const StyledCanvasWrap = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 1;
  canvas {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 255, 0, 0.1);
  }
`;
