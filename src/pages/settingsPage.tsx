import React, {useRef} from "react";
import {getDatabaseData, setDatabaseData} from "../services/StorageService";
import {fileSaver} from "../shared/utills";

const SettingsPage = () => {
    const uploadFileRef = useRef<HTMLInputElement>(null)

    const downloadHandler = () => {
        const content = getDatabaseData()
        fileSaver({content})
    }

    const uploadHandler = () => {
        if (uploadFileRef.current && uploadFileRef.current.files && uploadFileRef.current.files.length) {
            const isConfirmed = confirm('A you sure?\nPrevious DataBase will be destroyed!')
            if (!isConfirmed) return;

            const uploadedFile = uploadFileRef.current.files[0]
            const reader = new FileReader();

            reader.addEventListener("load", function (e) {
                if (e.target) {
                    const content = e.target.result as string

                    setDatabaseData(content)
                    window.location.reload();
                }
            }, false);
            reader.readAsText(uploadedFile);
        }
    }

    return (
        <div>
            <h2>Settings Page</h2>
            <div>
                <h3>Storage</h3>
                <div style={{display: "grid"}}>
                    <button onClick={downloadHandler}>Download Database</button>
                    <label>
                        Upload Database
                        <input type="file" name="database" accept="application/json" ref={uploadFileRef}/>
                        <button onClick={uploadHandler}>Upload Database</button>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage
