"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Form states required by your FastAPI /review parameters
  const [employeeName, setEmployeeName] = useState<string>("Vedant Padole");
  const [department, setDepartment] = useState<string>("Engineering");
  const [grade, setGrade] = useState<string>("L4");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const uploadedFiles = Array.from(e.target.files);
    setFiles(uploadedFiles);
  };

  const handleStartReview = async () => {
    if (files.length === 0) {
      alert("Please upload at least one receipt.");
      return;
    }

    if (!employeeName || !department || !grade) {
      alert("Please fill out all employee metadata fields.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Prepare Multipart FormData matching the backend expectations
      const formData = new FormData();
      formData.append("employee_name", employeeName);
      formData.append("department", department);
      formData.append("grade", grade);
      
      files.forEach((file) => {
        formData.append("files", file);
      });

      // 2. Fetch from your backend environment setup
      const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://vedant1405-greengrowth.hf.space";
      const cleanUrl = backendBaseUrl.endsWith("/") ? backendBaseUrl.slice(0, -1) : backendBaseUrl;

      // Point directly to your FastAPI @app.post("/review") route
      const response = await fetch(`${cleanUrl}/review`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Backend Error: ${response.statusText} (${response.status})`);
      }

      const data = await response.json();

      // 3. Cache the pipeline graph results into LocalStorage
      localStorage.setItem("reviewResult", JSON.stringify(data));

      // 4. Redirect over to the details visualizer page
      router.push("/review");
    } catch (error) {
      console.error("API Processing Failed:", error);
      alert("Failed to process receipts. Please ensure your backend is awake and metadata is structural.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f5f0] to-[#dfe9e3] flex items-center justify-center px-6 py-12">
      <div className="relative w-full max-w-md">
        <motion.div
          className="absolute inset-0 rounded-[36px] blur-3xl opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, #4ade80 0%, transparent 60%)",
              "radial-gradient(circle at 80% 70%, #22c55e 0%, transparent 60%)",
              "radial-gradient(circle at 40% 60%, #16a34a 0%, transparent 60%)",
            ],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative border border-white/40 rounded-[36px] p-8 bg-white/60 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold shadow-md">
                AI
              </div>
            </div>

            <div className="text-center mt-4">
              <h1 className="text-4xl font-serif text-green-900 leading-tight">
                Review Expenses.
                <br />
                <span className="text-green-700 italic">With Policy AI.</span>
              </h1>
            </div>

            {/* Form Inputs required by your backend parameters */}
            <div className="mt-6 space-y-3 text-left">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Employee Name</label>
                <input 
                  type="text" 
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full px-4 py-2 text-sm bg-white/80 border rounded-xl outline-none focus:border-green-500"
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Department</label>
                  <input 
                    type="text" 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2 text-sm bg-white/80 border rounded-xl outline-none focus:border-green-500"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Grade</label>
                  <input 
                    type="text" 
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-2 text-sm bg-white/80 border rounded-xl outline-none focus:border-green-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="mt-6">
              <label className="block border-2 border-dashed border-green-300 rounded-2xl p-5 bg-white/50 cursor-pointer hover:bg-white/70 transition">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="hidden"
                />
                <p className="text-green-900 font-semibold">
                  Upload receipts
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, JPG, JPEG, PNG supported
                </p>
              </label>

              {files.length > 0 && (
                <div className="mt-3 text-left bg-white/60 rounded-xl p-3 max-h-24 overflow-y-auto border">
                  {files.map((file, index) => (
                    <p key={index} className="text-xs text-gray-700 truncate">
                      {index + 1}. {file.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Trigger Button Area */}
          <div className="w-full mt-6">
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.01 }}
              onClick={handleStartReview}
              disabled={isLoading || files.length === 0}
              className={`w-full text-white py-4 rounded-2xl text-lg font-semibold shadow-md transition ${
                isLoading || files.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {isLoading ? "Invoking Review Graph..." : "Start AI Review"}
            </motion.button>

            <p className="text-center text-xs text-gray-500 mt-3">
              PDF + image receipts · Policy-grounded review
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
