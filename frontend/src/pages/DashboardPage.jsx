import { useEffect, useState } from "react";
import api from "../services/api";

function DashboardPage() {

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        fetchDashboard();

    }, []);


    async function fetchDashboard() {

        try {

            const response =
                await api.get("/dashboard/1");

            setDashboard(
                response.data
            );
        }

        catch (error) {

            console.error(error);
        }

        finally {

            setLoading(false);
        }
    }


    if (loading) {

        return (

            <div className="page">

                <h2>Loading Dashboard...</h2>

            </div>
        );
    }


    return (

        <div className="page">

            <h1>
                Customer Dashboard
            </h1>


            <div className="card">

                <h2>
                    {dashboard.customer.name}
                </h2>

                <p>
                    Tier:
                    {" "}
                    {dashboard.customer.tier}
                </p>

                <p>
                    Monthly Revenue:
                    {" "}
                    $
                    {dashboard.customer.mrr}
                </p>

            </div>


            <div className="card">

                <h2>
                    Customer Health
                </h2>

                <p>
                    Health Score:
                    {" "}
                    {dashboard.health.score}
                </p>

                <p>
                    NPS:
                    {" "}
                    {dashboard.health.nps}
                </p>

                <p>
                    CSAT:
                    {" "}
                    {dashboard.health.csat}
                </p>

                <p>
                    Adoption:
                    {" "}
                    {dashboard.health.adoption}%
                </p>

            </div>


            <div className="card">

                <h2>
                    Renewal Information
                </h2>

                <p>
                    Renewal Date:
                    {" "}
                    {dashboard.renewal.date}
                </p>

                <p>
                    Contract Value:
                    {" "}
                    $
                    {dashboard.renewal.value}
                </p>

                <p>
                    Auto Renew:
                    {" "}
                    {dashboard.renewal.autoRenew
                        ? "Yes"
                        : "No"}
                </p>

            </div>


            <div className="card">

                <h2>
                    Upsell Opportunities
                </h2>

                <ul>

                    {dashboard.opportunities.map(
                        (item, index) => (

                            <li key={index}>
                                {item}
                            </li>
                        )
                    )}

                </ul>

            </div>

        </div>
    );
}

export default DashboardPage;