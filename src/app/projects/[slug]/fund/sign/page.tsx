"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchWithAuth } from '@/utils/api';
import SignatureCanvas from 'react-signature-canvas';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function SignContract(props: { params: Promise<{ slug: string }> }) {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const investmentId = searchParams.get('investment_id');
    const params = React.use(props.params);
    const [investment, setInvestment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [contractUrl, setContractUrl] = useState('');

    const sigCanvas = useRef<any>(null);

    useEffect(() => {
        if (!investmentId) {
            setError("Investment ID is missing.");
            setLoading(false);
            return;
        }

        const fetchInvestmentData = async () => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
            // We fetch the user's investments and find the matching ID
            const res = await fetchWithAuth(`${API_URL}/api/investor/investments`);
            if (res.ok) {
                const data = await res.json();
                const inv = data.find((i: any) => i.id == investmentId);
                if (inv) {
                    if (inv.contract_pdf_path) {
                        // Already signed
                        setContractUrl(API_URL + inv.contract_pdf_path);
                        setSuccess(true);
                    }
                    setInvestment(inv);
                } else {
                    setError('Investment not found or unauthorized.');
                }
            } else {
                setError('Failed to load investment data.');
            }
            setLoading(false);
        };
        fetchInvestmentData();
    }, [investmentId]);

    const clearSignature = () => {
        if (sigCanvas.current) {
            sigCanvas.current.clear();
        }
    };

    const submitSignature = async () => {
        if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
            setError('Please provide your signature before confirming.');
            return;
        }

        setError('');
        setSubmitting(true);
        const signatureBase64 = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';

        try {
            const res = await fetchWithAuth(`${API_URL}/api/investor/investments/${investmentId}/sign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ signature: signatureBase64 })
            });

            const data = await res.json();
            if (res.ok) {
                setContractUrl(API_URL + data.contract_url); // Laravel might return full URL or path
                setSuccess(true);
            } else {
                setError(data.message || 'Failed to generate contract.');
            }
        } catch (e) {
            setError('System connection error.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#030a08] flex items-center justify-center p-6"><div className="text-xl font-bold text-slate-500 animate-pulse">Loading Agreement...</div></div>;
    if (error && !investment) return <div className="min-h-screen flex text-center mt-20 justify-center text-rose-500 font-bold">{error}</div>;

    if (success) {
        return (
            <div className="min-h-screen bg-[#030a08] flex items-center justify-center p-6 selection:bg-primary-500/30">
                <div className="bg-[#05100c] max-w-lg w-full rounded-3xl shadow-[0_20px_50px_rgba(4,120,87,0.15)] border border-primary-500/20 p-10 text-center">
                    <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-400 text-4xl">
                        ✓
                    </div>
                    <h2 className="text-2xl font-black text-white mb-4">Investment Secured!</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Your electronic agreement has been successfully stamped and converted into a legally binding PDF.
                    </p>
                    <div className="space-y-4">
                        {contractUrl && (
                            <a href={contractUrl.startsWith('http') ? contractUrl : process.env.NEXT_PUBLIC_API_URL + contractUrl} target="_blank" rel="noopener noreferrer" className="block w-full border border-primary-500 text-primary-400 font-bold py-4 rounded-xl hover:bg-primary-500/10 transition-colors">
                                Download Contract PDF
                            </a>
                        )}
                        <Link href="/portal/dashboard" className="block w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl shadow-[0_10px_30px_rgba(4,120,87,0.4)] transition-all">
                            Go to Investor Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030a08] pt-24 pb-20 selection:bg-primary-500/30 font-sans">
            <div className="max-w-4xl mx-auto px-6 relative z-10">

                <h1 className="text-3xl md:text-4xl font-black text-white text-center mb-10">Electronic Investment Agreement</h1>

                {/* Contract Text Sandbox */}
                <div className="bg-white text-[#1E1E1E] p-8 md:p-12 rounded-t-3xl shadow-xl max-w-none text-left" dir="ltr" style={{ fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: '1.6' }}>

                    <div className="text-center border-b-2 border-[#C8A951] pb-6 mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#0B0B0B] mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>iFuture Hub</h1>
                        <p className="text-[#C8A951] uppercase tracking-widest text-sm font-bold mb-6">Premium Digital Investment Platform</p>
                        <h2 className="text-2xl font-normal text-[#0B0B0B] m-0 uppercase tracking-wide" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Equity Investment Agreement</h2>
                    </div>

                    <div className="mb-8 text-[15px] text-[#1E1E1E]">
                        This Investment Agreement ("Agreement") is made on <strong>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>, by and between:
                    </div>

                    <div className="bg-[#FAFAFA] border border-[#EAEAEA] border-l-4 border-l-[#C8A951] p-5 rounded-md mb-6">
                        <h3 className="text-xl text-[#0B0B0B] font-bold border-b border-[#EAEAEA] pb-2 mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Company:</h3>
                        <div className="text-[15px]">
                            <strong>iFuture Hub (iFuture LLC)</strong><br />
                            A technology company specializing in digital platforms, software solutions, and SaaS systems.<br />
                            Represented by: <strong>Emad Ghafari</strong><br />
                            <em className="text-gray-500 block mt-2">Hereinafter referred to as "the Company"</em>
                        </div>
                    </div>

                    <div className="bg-[#FAFAFA] border border-[#EAEAEA] border-l-4 border-l-[#C8A951] p-5 rounded-md mb-8">
                        <h3 className="text-xl text-[#0B0B0B] font-bold border-b border-[#EAEAEA] pb-2 mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Investor:</h3>
                        <div className="text-[15px]">
                            Name: <strong>{investment?.user?.name || 'N/A'}</strong><br />
                            ID / Reference: <strong>#{investment?.user?.id || 'N/A'}</strong><br />
                            <em className="text-gray-500 block mt-2">Hereinafter referred to as "the Investor"</em>
                        </div>
                    </div>

                    <div className="text-center italic text-[#1E1E1E] mb-10">
                        The Company and the Investor shall collectively be referred to as "the Parties".
                    </div>

                    <h3 className="text-xl font-bold text-[#0B0B0B] border-b border-[#EAEAEA] pb-2 mt-8 mb-4 w-fit pr-8" style={{ fontFamily: '"Times New Roman", Times, serif' }}>1. Purpose of the Agreement</h3>
                    <p className="text-[15px] mb-6">
                        The Investor agrees to invest in the following project developed and operated by the Company:<br /><br />
                        <strong>{investment?.project?.title || 'N/A'}</strong><br /><br />
                        The project is a digital system / platform, and is fully owned, managed, and operated by iFuture LLC.
                    </p>

                    <h3 className="text-xl font-bold text-[#0B0B0B] border-b border-[#EAEAEA] pb-2 mt-8 mb-4 w-fit pr-8" style={{ fontFamily: '"Times New Roman", Times, serif' }}>2. Investment Amount and Equity</h3>
                    <p className="text-[15px] mb-6">
                        The Investor agrees to invest the total amount of:
                        <div className="bg-[#FDFBEE] border border-[#C8A951] text-center p-4 rounded-md my-4 text-xl font-bold text-[#C8A951]">
                            ${Number(investment?.amount || 0).toLocaleString()} USD
                        </div>
                        in exchange for an equity ownership of:
                        <div className="bg-[#FDFBEE] border border-[#C8A951] text-center p-4 rounded-md my-4 text-xl font-bold text-[#C8A951]">
                            {investment?.shares} Shares
                        </div>
                        in the project specified above.
                    </p>

                    <h3 className="text-xl font-bold text-[#0B0B0B] border-b border-[#EAEAEA] pb-2 mt-8 mb-4 w-fit pr-8" style={{ fontFamily: '"Times New Roman", Times, serif' }}>3. Protection, Risk, and Compliance</h3>
                    <ul className="list-none pl-0 space-y-3 text-[15px] mb-8">
                        <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#C8A951] before:text-lg before:-top-1">
                            <strong>Investor Protection:</strong> The Investor's equity ownership will be respected and recorded in the Company's internal equity registry.
                        </li>
                        <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#C8A951] before:text-lg before:-top-1">
                            <strong>Electronic Signature:</strong> The Parties agree that electronic signatures executed through the Company's digital platform shall be legally binding and equivalent to handwritten signatures. This Agreement shall be governed by the applicable laws in which iFuture LLC operates.
                        </li>
                    </ul>
                </div>

                {/* Signature UI */}
                <div className="bg-[#091512] rounded-b-3xl border border-white/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="mb-6 flex justify-between items-center text-white">
                        <div>
                            <h3 className="font-bold text-lg text-primary-400">Please Sign Below</h3>
                            <p className="text-sm text-slate-400">Use your mouse or finger to draw your signature.</p>
                        </div>
                        <button onClick={clearSignature} className="text-sm font-bold text-slate-400 hover:text-white border border-slate-700 px-4 py-2 rounded-lg transition-colors">
                            Clear Signature
                        </button>
                    </div>

                    <div className="bg-white rounded-xl overflow-hidden shadow-inner mb-8 border border-slate-300 flex justify-center w-full" style={{ height: 250 }}>
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="blue"
                            canvasProps={{ className: 'sigCanvas w-full h-full cursor-crosshair' }}
                        />
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-sm font-bold text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={submitSignature}
                        disabled={submitting}
                        className="w-full bg-primary-600 hover:bg-primary-500 text-white font-extrabold py-5 px-6 rounded-2xl shadow-[0_10px_30px_rgba(4,120,87,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center text-lg uppercase tracking-wider"
                    >
                        {submitting ? (
                            <span className="flex items-center gap-3">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Generating Dynamic PDF...
                            </span>
                        ) : (
                            'Sign & Finalize Agreement'
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
