"use client";
import React from "react";
import { motion } from "motion/react";

interface Certification {
  title: string;
  issuer: string;
  issue_date: string;
  credential_id?: string;
  credential_url?: string;
  logo_url?: string;
}

export const CertificationsColumn = (props: {
  className?: string;
  certifications: Certification[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.certifications.map((cert, i) => (
                <div
                  className="p-8 rounded-3xl border-2 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl max-w-xs w-full"
                  key={i}
                >
                  {cert.logo_url && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                      <img
                        src={cert.logo_url}
                        alt={cert.issuer}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <h3 className="text-lg font-black text-black dark:text-white mb-2">
                    {cert.title}
                  </h3>
                  
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                    {cert.issuer}
                  </p>
                  
                  {cert.issue_date && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Issued: {cert.issue_date}
                    </p>
                  )}
                  
                  {cert.credential_id && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 font-mono mb-3">
                      ID: {cert.credential_id}
                    </p>
                  )}
                  
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                    >
                      View Credential
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
