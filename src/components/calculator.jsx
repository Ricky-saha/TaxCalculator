import { useState } from "react";
import { Calculator, Home, Info, Settings } from "lucide-react";

// Previous deduction arrays remain the same
const oldRegimeDeductions = [
    { id: "standardDeduction", label: "Standard Deduction", max: 50000, isDefault: true },
    { id: "section80C", label: "80C (PPF, EPF, LIC, ELSS, etc.)", max: 150000 },
    { id: "section80D", label: "80D (Health Insurance)", max: 25000, seniorMax: 50000 },
    { id: "section80E", label: "80E (Education Loan Interest)", max: Infinity },
    { id: "hra", label: "HRA (House Rent Allowance)", max: Infinity },
    { id: "lta", label: "LTA (Leave Travel Allowance)", max: Infinity },
    { id: "section80TTA", label: "80TTA (Savings Account Interest)", max: 10000 }
];

const newRegimeDeductions = [
    { id: "standardDeduction", label: "Standard Deduction", max: 50000, isDefault: true },
    { id: "section80E", label: "80E (Education Loan Interest)", max: Infinity },
    { id: "employerNPS", label: "Employer's NPS Contribution (80CCD(2))", max: Infinity, info: "10% of Basic Salary" }
];

const TaxCalculator = () => {
    // Previous state declarations remain the same
    const [income, setIncome] = useState("");
    const [activeTab, setActiveTab] = useState("new");
    const [oldDeductions, setOldDeductions] = useState({
        standardDeduction: 50000
    });
    const [newDeductions, setNewDeductions] = useState({
        standardDeduction: 50000
    });
    const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
    const [taxResult, setTaxResult] = useState(null);
    const [activeNavItem, setActiveNavItem] = useState("calculator");

    // Previous calculation functions remain the same
    const calculateNewRegimeTax = (income, deductions) => {
        let taxableIncome = income - Object.values(deductions).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        if (taxableIncome <= 1200000) return 0;

        let tax = 0;
        let remainingIncome = taxableIncome;

        if (remainingIncome > 2400000) {
            tax += (remainingIncome - 2400000) * 0.30;
            remainingIncome = 2400000;
        }
        if (remainingIncome > 2000000) {
            tax += (remainingIncome - 2000000) * 0.25;
            remainingIncome = 2000000;
        }
        if (remainingIncome > 1600000) {
            tax += (remainingIncome - 1600000) * 0.20;
            remainingIncome = 1600000;
        }
        if (remainingIncome > 1200000) {
            tax += (remainingIncome - 1200000) * 0.15;
        }

        return Math.max(0, tax);
    };

    const calculateOldRegimeTax = (income, deductions) => {
        let taxableIncome = income - Object.values(deductions).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        if (taxableIncome <= 250000) return 0;

        let tax = 0;
        let remainingIncome = taxableIncome;

        if (remainingIncome > 1000000) {
            tax += (remainingIncome - 1000000) * 0.30;
            remainingIncome = 1000000;
        }
        if (remainingIncome > 500000) {
            tax += (remainingIncome - 500000) * 0.20;
            remainingIncome = 500000;
        }
        if (remainingIncome > 250000) {
            tax += (remainingIncome - 250000) * 0.05;
        }

        return Math.max(0, tax);
    };

    const calculateTax = () => {
        const grossIncome = parseFloat(income) || 0;
        const newTax = calculateNewRegimeTax(grossIncome, newDeductions);
        const oldTax = calculateOldRegimeTax(grossIncome, oldDeductions);
        
        setTaxResult({
            newRegimeTax: newTax,
            oldRegimeTax: oldTax,
            recommended: oldTax < newTax ? "Old" : "New",
            savings: Math.abs(oldTax - newTax)
        });
    };

    const handleDeductionChange = (id, amount, isOldRegime = true) => {
        const deductions = isOldRegime ? oldRegimeDeductions : newRegimeDeductions;
        const deduction = deductions.find(d => d.id === id);
        const maxLimit = id === 'section80D' && isSeniorCitizen ? deduction.seniorMax : deduction.max;
        const value = maxLimit === Infinity ? amount : Math.min(amount, maxLimit);

        if (isOldRegime) {
            setOldDeductions(prev => ({ ...prev, [id]: value }));
        } else {
            setNewDeductions(prev => ({ ...prev, [id]: value }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between">
                        <div className="flex space-x-7">
                            <div className="flex items-center py-4">
                                <span className="font-bold text-xl text-gray-800">TaxCalc</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <button 
                                    onClick={() => setActiveNavItem("home")}
                                    className={`py-4 px-3 flex items-center space-x-2 ${activeNavItem === "home" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                                >
                                    <Home size={20} />
                                    <span>Home</span>
                                </button>
                                <button 
                                    onClick={() => setActiveNavItem("calculator")}
                                    className={`py-4 px-3 flex items-center space-x-2 ${activeNavItem === "calculator" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                                >
                                    <Calculator size={20} />
                                    <span>Calculator</span>
                                </button>
                                <button 
                                    onClick={() => setActiveNavItem("info")}
                                    className={`py-4 px-3 flex items-center space-x-2 ${activeNavItem === "info" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                                >
                                    <Info size={20} />
                                    <span>Tax Info</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button 
                                onClick={() => setActiveNavItem("settings")}
                                className={`py-4 px-3 flex items-center space-x-2 ${activeNavItem === "settings" ? "text-blue-500" : "text-gray-500"}`}
                            >
                                <Settings size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto pt-8 px-4 pb-12">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden backdrop-blur-lg bg-opacity-95">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                        <h1 className="text-3xl font-bold text-white text-center">Income Tax Calculator 2025-26</h1>
                    </div>

                    {/* Calculator Content */}
                    <div className="p-6">
                        {/* Income Input */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-lg font-semibold">Annual Income</label>
                                <div className="flex items-center gap-2">
                                    <label>Senior Citizen</label>
                                    <input
                                        type="checkbox"
                                        checked={isSeniorCitizen}
                                        onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                </div>
                            </div>
                            <input
                                type="number"
                                value={income}
                                onChange={(e) => setIncome(e.target.value)}
                                placeholder="Enter Annual Income"
                                className="w-full p-3 border rounded-lg bg-white bg-opacity-90"
                            />
                        </div>

                        {/* Regime Tabs */}
                        <div className="mb-6">
                            <div className="flex border-b">
                                <button
                                    onClick={() => setActiveTab("new")}
                                    className={`px-4 py-2 ${activeTab === "new" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
                                >
                                    New Regime
                                </button>
                                <button
                                    onClick={() => setActiveTab("old")}
                                    className={`px-4 py-2 ${activeTab === "old" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
                                >
                                    Old Regime
                                </button>
                            </div>

                            <div className="mt-4">
                                {activeTab === "new" ? (
                                    <div className="space-y-4">
                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                                            <p className="text-sm">✓ No tax up to ₹12,00,000</p>
                                            <p className="text-sm">✓ Limited deductions available</p>
                                            <p className="text-sm">✓ Standard deduction of ₹50,000 included</p>
                                        </div>
                                        {newRegimeDeductions.map(deduction => (
                                            <div key={deduction.id} className="p-4 border rounded-lg bg-white">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium">{deduction.label}</p>
                                                        {deduction.info && <p className="text-sm text-gray-500">{deduction.info}</p>}
                                                    </div>
                                                    {!deduction.isDefault && (
                                                        <input
                                                            type="number"
                                                            placeholder="Amount"
                                                            onChange={(e) => handleDeductionChange(deduction.id, e.target.value, false)}
                                                            className="w-32 p-2 border rounded"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                                            <p className="text-sm">✓ Multiple deductions available</p>
                                            <p className="text-sm">✓ Better for those with investments</p>
                                            <p className="text-sm">✓ Includes HRA and LTA benefits</p>
                                        </div>
                                        {oldRegimeDeductions.map(deduction => (
                                            <div key={deduction.id} className="p-4 border rounded-lg bg-white">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium">{deduction.label}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Max: ₹{deduction.max === Infinity ? "No Limit" : 
                                                                (deduction.id === 'section80D' && isSeniorCitizen ? 
                                                                    deduction.seniorMax.toLocaleString() : 
                                                                    deduction.max.toLocaleString())}
                                                        </p>
                                                    </div>
                                                    {!deduction.isDefault && (
                                                        <input
                                                            type="number"
                                                            placeholder="Amount"
                                                            onChange={(e) => handleDeductionChange(deduction.id, e.target.value)}
                                                            className="w-32 p-2 border rounded"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Calculate Button */}
                        <button
                            onClick={calculateTax}
                            className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            Calculate Tax
                        </button>

                        {/* Results */}
                        {taxResult && (
                            <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                                        <h3 className="text-lg font-semibold mb-2">New Regime Tax</h3>
                                        <p className="text-2xl font-bold text-blue-600">
                                            ₹{taxResult.newRegimeTax.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                                        <h3 className="text-lg font-semibold mb-2">Old Regime Tax</h3>
                                        <p className="text-2xl font-bold text-purple-600">
                                            ₹{taxResult.oldRegimeTax.toLocaleString()}
                                        </p>
                                    </div>
                                    </div>
                                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">Recommended Regime</h3>
                                    <p className="text-xl font-bold text-green-600">
                                        {taxResult.recommended} Regime
                                        <span className="text-sm font-normal text-green-700 block">
                                            You can save ₹{taxResult.savings.toLocaleString()} with this regime
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tax Slab Information Cards */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* New Regime Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-blue-600">New Regime Tax Slabs</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Up to ₹12,00,000</span>
                                <span className="font-medium">0%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>₹12,00,001 - ₹16,00,000</span>
                                <span className="font-medium">15%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>₹16,00,001 - ₹20,00,000</span>
                                <span className="font-medium">20%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>₹20,00,001 - ₹24,00,000</span>
                                <span className="font-medium">25%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Above ₹24,00,000</span>
                                <span className="font-medium">30%</span>
                            </div>
                        </div>
                    </div>

                    {/* Old Regime Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-purple-600">Old Regime Tax Slabs</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Up to ₹2,50,000</span>
                                <span className="font-medium">0%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>₹2,50,001 - ₹5,00,000</span>
                                <span className="font-medium">5%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>₹5,00,001 - ₹10,00,000</span>
                                <span className="font-medium">20%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Above ₹10,00,000</span>
                                <span className="font-medium">30%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Information */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Important Notes</h2>
                    <div className="space-y-2 text-gray-600">
                        <p>• The new tax regime is the default option from FY 2025-26</p>
                        <p>• Standard deduction of ₹50,000 is available in both regimes</p>
                        <p>• Education loan interest deduction (80E) is allowed in both regimes</p>
                        <p>• HRA, LTA, and most other deductions are only available in the old regime</p>
                        <p>• Choose the old regime if you have significant investments and deductions</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaxCalculator;

