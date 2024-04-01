
"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import { useEdgeStore } from "../lib/edgestore";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [fileRemoteUrl, setFileRemoteUrl] = useState<string>("");
  const [progressVal, setProgressVal] = useState<number>(0);

  const { edgestore } = useEdgeStore();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    try {
      const res = await edgestore.myPublicImages.upload({
        file,
        onProgressChange: (progress) => {
          setProgressVal(progress);
        },
      });
      setFileRemoteUrl(res.url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="p-24 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-semibold">Edge Store File Upload Demo</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 items-center"
      >
        <input type="file" onChange={handleFileChange} />
        
        <div className="h-2 my-4 w-40 overflow-hidden rounded border">
          <div
            className="h-full bg-white transition-all duration-150"
            style={{ width: `${progressVal}%` }}
          ></div>
        </div>

        <button className="px-4 py-2 bg-blue-800 text-white font-medium rounded-sm">
          Upload File
        </button>
      </form>

      {fileRemoteUrl && (
        <Image
          src={fileRemoteUrl}
          width={250}
          height={250}
          alt="uploaded-file"
        />
      )}
    </main>
  );
}