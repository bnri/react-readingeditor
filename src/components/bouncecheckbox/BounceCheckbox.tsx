import styled from "styled-components";

interface BounceCheckboxProps {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const BounceCheckbox: React.FC<BounceCheckboxProps> = ({ checked, onChange }) => {
  return (
    <StyledCheckBoxWrap>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <svg viewBox="0 0 21 21">
        <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
      </svg>
    </StyledCheckBoxWrap>
  );
};

export default BounceCheckbox;

const StyledCheckBoxWrap = styled.label`
  --background: #fff;
  --border: #d1d6ee;
  --border-hover: #bbc1e1;
  --border-active: rgb(115, 103, 240);
  --tick: #fff;
  --stroke: var(--tick);
  position: relative;
  input,
  svg {
    width: 21px;
    height: 21px;
    display: block;
  }
  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    position: relative;
    outline: none;
    background: var(--background);
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    border-radius: 4px;
    transition: box-shadow 0.3s;
    box-shadow: inset 0 0 0 var(--s, 1px) var(--b, var(--border));
    &:hover {
      --s: 2px;
      --b: var(--border-hover);
    }
    &:checked {
      --b: var(--border-active);
      --s: 11px;
      & + svg {
        animation: bounce 0.4s linear forwards 0.2s;
      }
    }
  }
  svg {
    pointer-events: none;
    fill: none;
    stroke-width: 2px;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: var(--stroke, var(--border-active));
    position: absolute;
    top: 0;
    left: 0;
    width: 21px;
    height: 21px;
    transform: scale(var(--scale, 1)) translateZ(0);
    --scale: 0;
  }

  @keyframes bounce {
    50% {
      transform: scale(1.2);
    }
    75% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
`;
