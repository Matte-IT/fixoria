import { Helmet } from "react-helmet-async";

const PageTitle = ({ title }) => {
  return (
    <Helmet>
      <title>{`Fixoria • ${title}`}</title>
    </Helmet>
  );
};

export default PageTitle;
