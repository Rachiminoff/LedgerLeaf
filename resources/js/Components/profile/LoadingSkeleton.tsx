import React from 'react';

export default function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-black p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="h-8 w-48 bg-[#171717] rounded-lg animate-pulse" />
                    <div className="h-4 w-72 bg-[#171717] rounded-lg animate-pulse mt-2" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column Skeleton */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#171717] animate-pulse" />
                                <div className="flex-1">
                                    <div className="h-5 w-32 bg-[#171717] rounded animate-pulse" />
                                    <div className="h-4 w-48 bg-[#171717] rounded animate-pulse mt-2" />
                                    <div className="h-3 w-24 bg-[#171717] rounded animate-pulse mt-2" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="h-10 bg-[#171717] rounded-xl animate-pulse" />
                                <div className="h-10 bg-[#171717] rounded-xl animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column Skeleton */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6">
                            <div className="h-4 w-32 bg-[#171717] rounded animate-pulse mb-4" />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="bg-[#171717] rounded-xl p-4">
                                        <div className="h-3 w-16 bg-[#111111] rounded animate-pulse mb-2" />
                                        <div className="h-6 w-20 bg-[#111111] rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6">
                            <div className="h-4 w-32 bg-[#171717] rounded animate-pulse mb-4" />
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex justify-between py-2 border-b border-[#242424]">
                                        <div className="h-4 w-20 bg-[#171717] rounded animate-pulse" />
                                        <div className="h-4 w-32 bg-[#171717] rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}