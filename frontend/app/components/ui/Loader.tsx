import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="progress-loader">
        <div className="progress" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .progress-loader {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    width: 150px;
    background: rgba(249, 198, 81, 0.253);
    height: 10px;
    border-radius: 7px;
    overflow: hidden;
  }

  .progress {
    width: 1px;
    height: 10px;
    border-radius: 7px;
    background: rgb(249, 198, 81);
    transition: 0.5s;
    animation: loading_44 2s cubic-bezier(0.4, 1.01, 1, 1) forwards;
  }

  @keyframes loading_44 {
    0% {
      width: 0%;
    }

    100% {
      width: 100%;
    }
  }`;

export default Loader;
