import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const Public = () => {
    let { user, isLoading } = useSelector((store: any) => store.auth);

    if (isLoading) return <h1>Loading...</h1>;

    if (user) return <Navigate to={"/profile"} />;

    return <Outlet />;
};

export default Public;