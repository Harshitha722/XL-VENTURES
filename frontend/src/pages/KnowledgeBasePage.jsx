import { useEffect, useState } from "react";
import api from "../services/api";

export default function KnowledgeBasePage() {
    const [playbooks, setPlaybooks] = useState([]);

    useEffect(() => {
        api.get("/knowledge/playbooks")
            .then((response) => setPlaybooks(response.data))
            .catch(() => {});
    }, []);

    return (
        <div className="page knowledge-page">
            <h1>Enterprise Knowledge Base</h1>
            <p className="subtitle">
                {playbooks.length} playbooks embedded and indexed. Retrieved via semantic similarity at analysis time.
            </p>
            <div className="playbook-grid">
                {playbooks.map((playbook) => (
                    <div key={playbook.id} className="playbook-card">
                        <div className="playbook-category">{playbook.category.replace(/_/g, " ")}</div>
                        <h3>{playbook.title}</h3>
                        <p>{playbook.content.slice(0, 180)}...</p>
                        <div className="playbook-tags">
                            {playbook.tags.map((tag) => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
