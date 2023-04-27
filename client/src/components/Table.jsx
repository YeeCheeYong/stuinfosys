import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  width: ${(props) => (props.noMargin ? `100%` : '70%')};
  margin: auto;
  margin-bottom: ${(props) => (props.small ? `16px` : '60px')};
  border-radius: 10px;
  margin-top: ${(props) => (props.noMargin ? `0px` : '24px')};
`;

const StyledTable = styled.div`
  width: 100%;
  padding: 12px;
`;

const StyledThead = styled.div`
  background-color: #019595;
  color: white;
  font-size: x-large;
  border: none;
  border-radius: 10px;
  padding: 10px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  ${(props) =>
    props.small &&
    `
    font-size: large;
    padding: 2px 0px;
  `}
`;

const StyledTD = styled.div`
  width: ${(props) => props.width};
  padding: 0 8px;
`;

const StyledTR = styled.div`
  margin-top: 16px;
  width: 100%;
  background-color: #e2e2e2;
  padding: 8px;
  border: none;
  border-radius: 4px;
  ${(props) =>
    props.small &&
    `
      padding: 4px;
      margin-top: 8px;
      font-size: small;
  `}
  align-items: center;
  display: flex;
  overflow-x: scroll;
`;

export const NoDataContainer = styled.div`
  background-color: #fc6868;
  color: white;
  padding: 12px 0;
  text-align: center;
  margin-top: 8px;
  border: none;
  border-radius: 4px;
  width: 100%;
`;

function Table(props) {
  const { column, data, area, small } = props;
  return (
    <TableContainer noMargin={props.noMargin} small={small}>
      <StyledTable>
        {props.tableTitle ? (
          <StyledThead small={small}>
            <StyledTD>{props.tableTitle}</StyledTD>
          </StyledThead>
        ) : (
          <StyledThead small={small}>
            {column &&
              column.map((col, idx) => {
                return (
                  <StyledTD width={area[col]} key={idx}>
                    {col}
                  </StyledTD>
                );
              })}
          </StyledThead>
        )}

        {data &&
          data.map((row, index) => (
            <StyledTR key={index} small={small}>
              {column &&
                column.map((col, index) => (
                  <StyledTD width={area[col]} key={index}>
                    {row[col]}
                  </StyledTD>
                ))}
            </StyledTR>
          ))}

        {!data ||
          (!(data?.length && data.length > 0) && (
            <NoDataContainer>No Data Found!</NoDataContainer>
          ))}
      </StyledTable>
    </TableContainer>
  );
}

export default Table;
