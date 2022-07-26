import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const ScrollToTop = (props) => {
  const [prewPath, setPrewPath] = useState('')
  const location = useLocation();
 
  
  useEffect(() => {
    // console.log(location.pathname.split('/')[2], prewPath.split('/')[2])
    if(!prewPath || prewPath.split('/')[2] !== location.pathname.split('/')[2] || ( prewPath.split('/')[2] === undefined || location.pathname.split('/')[2] === undefined)){
      window.scrollTo(0, 0);
      
      setPrewPath(location.pathname)
    } else{
      setPrewPath(location.pathname)
    }

   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return <>{props.children}</>
};

export default ScrollToTop;