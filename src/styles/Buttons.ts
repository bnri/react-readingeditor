import styled from "styled-components";

export const StyledBtn = styled.button`
  width: 100px;
  height: 35px;
  margin-top: 5px;
  margin-left: 10px;
  margin-bottom: 5px;
  outline: none;
  border: none;
  border-radius: 4px;
  background-color: #7367f0;
  color: white;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  &:hover:not([disabled]) {
    background-color: #5e50ee;
    cursor: pointer;
  }
`;

export const StyledBtnSelected = styled(StyledBtn)`
  background-color: white;
  color: #7367f0;
  border: 1px solid #7367f0;
  transition: 0.2s;
  &:hover:not([disabled]) {
    background-color: rgb(240, 240, 240);
    color: #7367f0;
    border: 1px solid #7367f0;
    cursor: pointer;
  }
`;
export const StyledBtnOrange = styled(StyledBtn)`
  background-color: #fa8128;
  &:disabled {
    opacity: 0.7;
  }
  &:hover:not([disabled]) {
    background-color: #ed7014;
    cursor: pointer;
  }
`;

export const StyledBtnGreen = styled(StyledBtn)`
  background-color: #28a745;
  &:disabled {
    opacity: 0.7;
  }
  &:hover:not([disabled]) {
    background-color: #218838;
    cursor: pointer;
  }
`;

export const StyledBtnRed = styled(StyledBtn)`
  background-color: #dc3545;
  &:disabled {
    opacity: 0.7;
  }
  &:hover:not([disabled]) {
    background-color: #c82333;
    cursor: pointer;
  }
`;
