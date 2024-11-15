
//goTop.js COMPONENT

interface goTopProps {
  showGoTop: string;
  scrollUp: any;
}

const GoTop: React.FC<goTopProps> = ({showGoTop,scrollUp}) => {
    return (
      <>
        <div className={showGoTop} onClick={scrollUp}>
          <button className="goTop">
            <i className="goTop__text fas fa-chevron-up" />
          </button>
        </div>
      </>
    );
  };
export default GoTop;