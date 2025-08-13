import { Router } from 'express';
import { supervisorAgent } from '../agents/supervisor-agent';
import { metaSleuthService } from '../services/metasleuth-service';
import { chainabuseService } from '../services/chainabuse-service';
import { coinstatsService } from '../services/coinstats-service';
import { pepCheckerService } from '../services/pep-checker-service';
import { heliusEnhancedService } from '../services/helius-enhanced-service';

const router = Router();

// Comprehensive investigation using all data sources
router.post('/investigate', async (req, res) => {
  try {
    const { address, investigationType = 'full', userQuery } = req.body;

    if (!address) {
      return res.status(400).json({
        error: 'Address is required'
      });
    }

    console.log(`🔍 Starting comprehensive investigation for ${address}`);

    const result = await supervisorAgent.runInvestigation({
      address,
      investigationType,
      userQuery
    });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Comprehensive investigation error:', error);
    res.status(500).json({
      error: 'Investigation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Real-time wallet screening
router.post('/screen-wallet', async (req, res) => {
  try {
    const { address, chain = 'ethereum' } = req.body;

    if (!address) {
      return res.status(400).json({
        error: 'Address is required'
      });
    }

    console.log(`🛡️ Screening wallet ${address} on ${chain}`);

    // Run parallel screening across all services
    const [metasleuthResult, chainabuseResult] = await Promise.all([
      metaSleuthService.screenWallet(address, chain),
      chainabuseService.checkSanctionedAddress(address)
    ]);

    // Get additional context
    const addressLabels = await metaSleuthService.getAddressLabels(address);

    const screeningResult = {
      address,
      chain,
      timestamp: new Date().toISOString(),
      riskAssessment: {
        overallRisk: metasleuthResult.data.riskLevel,
        sanctionsMatch: chainabuseResult.data.sanctioned,
        blacklistMatch: metasleuthResult.data.blacklistMatch,
        mixerUsage: metasleuthResult.data.mixerServices.length > 0,
        illicitConnections: metasleuthResult.data.illicitServices.length > 0,
      },
      details: {
        metasleuth: metasleuthResult.data,
        chainabuse: chainabuseResult.data,
        labels: addressLabels.data.labels,
      },
      recommendations: generateScreeningRecommendations(metasleuthResult.data, chainabuseResult.data)
    };

    res.json({
      success: true,
      data: screeningResult
    });
  } catch (error) {
    console.error('Wallet screening error:', error);
    res.status(500).json({
      error: 'Wallet screening failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced transaction analysis
router.post('/analyze-transactions', async (req, res) => {
  try {
    const { address, chain = 'ethereum', limit = 100 } = req.body;

    if (!address) {
      return res.status(400).json({
        error: 'Address is required'
      });
    }

    console.log(`📊 Analyzing transactions for ${address}`);

    let transactionData;
    let balanceData;

    if (chain === 'solana') {
      // Use Helius for Solana
      const [transactions, addressInfo, nfts] = await Promise.all([
        heliusEnhancedService.getTransactionHistory(address, limit),
        heliusEnhancedService.getAddressInfo(address),
        heliusEnhancedService.getNFTsByOwner(address)
      ]);

      transactionData = transactions;
      balanceData = {
        lamports: addressInfo.lamports,
        solBalance: addressInfo.lamports / 1000000000,
        nfts: nfts.length
      };
    } else {
      // Use Coinstats for Ethereum/EVM
      const [transactions, balance, chart] = await Promise.all([
        coinstatsService.getWalletTransactions(address, chain, limit),
        coinstatsService.getWalletBalance(address, chain),
        coinstatsService.getWalletChart(address, chain, '30d')
      ]);

      transactionData = transactions;
      balanceData = {
        ...balance,
        chart: chart.slice(-30) // Last 30 data points
      };
    }

    // Analyze patterns
    const patterns = analyzeTransactionPatterns(transactionData);
    const riskMetrics = calculateRiskMetrics(transactionData, patterns);

    const analysisResult = {
      address,
      chain,
      timestamp: new Date().toISOString(),
      summary: {
        totalTransactions: transactionData.length,
        uniqueCounterparties: countUniqueCounterparties(transactionData),
        timespan: calculateTimespan(transactionData),
        totalVolume: calculateTotalVolume(transactionData),
      },
      balance: balanceData,
      patterns,
      riskMetrics,
      recentActivity: transactionData.slice(0, 10) // Most recent 10 transactions
    };

    res.json({
      success: true,
      data: analysisResult
    });
  } catch (error) {
    console.error('Transaction analysis error:', error);
    res.status(500).json({
      error: 'Transaction analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PEP and sanctions checking
router.post('/check-pep', async (req, res) => {
  try {
    const { name, dateOfBirth, nationality } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Name is required'
      });
    }

    console.log(`👤 Checking PEP status for ${name}`);

    const pepResult = await pepCheckerService.checkPEP({
      name,
      dateOfBirth,
      nationality,
      fuzzyMatch: true,
      includeAliases: true
    });

    res.json({
      success: true,
      data: pepResult.data
    });
  } catch (error) {
    console.error('PEP check error:', error);
    res.status(500).json({
      error: 'PEP check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Bulk address screening
router.post('/bulk-screen', async (req, res) => {
  try {
    const { addresses, chain = 'ethereum' } = req.body;

    if (!Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({
        error: 'Addresses array is required'
      });
    }

    if (addresses.length > 100) {
      return res.status(400).json({
        error: 'Maximum 100 addresses allowed per bulk request'
      });
    }

    console.log(`🔍 Bulk screening ${addresses.length} addresses`);

    // Process addresses in parallel with rate limiting
    const results = await Promise.all(
      addresses.map(async (address) => {
        try {
          const [metasleuthResult, chainabuseResult] = await Promise.all([
            metaSleuthService.screenWallet(address, chain),
            chainabuseService.checkSanctionedAddress(address)
          ]);

          return {
            address,
            riskLevel: metasleuthResult.data.riskLevel,
            sanctionsMatch: chainabuseResult.data.sanctioned,
            blacklistMatch: metasleuthResult.data.blacklistMatch,
            mixerUsage: metasleuthResult.data.mixerServices.length > 0,
            confidence: Math.max(metasleuthResult.data.confidence, chainabuseResult.data.confidence),
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          return {
            address,
            error: error instanceof Error ? error.message : 'Analysis failed',
            timestamp: new Date().toISOString()
          };
        }
      })
    );

    // Generate summary statistics
    const summary = {
      totalAddresses: addresses.length,
      highRisk: results.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length,
      sanctionsMatches: results.filter(r => r.sanctionsMatch).length,
      blacklistMatches: results.filter(r => r.blacklistMatch).length,
      mixerUsage: results.filter(r => r.mixerUsage).length,
      errors: results.filter(r => r.error).length
    };

    res.json({
      success: true,
      data: {
        summary,
        results,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Bulk screening error:', error);
    res.status(500).json({
      error: 'Bulk screening failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper functions
function generateScreeningRecommendations(metasleuth: any, chainabuse: any): string[] {
  const recommendations = [];

  if (chainabuse.sanctioned) {
    recommendations.push('IMMEDIATE ACTION: Address is sanctioned - freeze all transactions');
    recommendations.push('Report to compliance team immediately');
  }

  if (metasleuth.riskLevel === 'high' || metasleuth.riskLevel === 'critical') {
    recommendations.push('Enhanced due diligence required');
    recommendations.push('Consider filing SAR (Suspicious Activity Report)');
  }

  if (metasleuth.mixerServices.length > 0) {
    recommendations.push('Investigate mixer service usage for money laundering');
  }

  if (metasleuth.blacklistMatch) {
    recommendations.push('Address found on blacklist - review transaction history');
  }

  if (recommendations.length === 0) {
    recommendations.push('Continue normal monitoring');
    recommendations.push('Schedule periodic review');
  }

  return recommendations;
}

function analyzeTransactionPatterns(transactions: any[]): any[] {
  const patterns = [];

  // Check for rapid transactions
  if (hasRapidTransactions(transactions)) {
    patterns.push({
      type: 'rapid_transactions',
      description: 'Multiple transactions in short time period',
      risk: 'medium'
    });
  }

  // Check for round amounts (possible structuring)
  if (hasRoundAmounts(transactions)) {
    patterns.push({
      type: 'round_amounts',
      description: 'Suspicious round-number transactions',
      risk: 'medium'
    });
  }

  return patterns;
}

function hasRapidTransactions(transactions: any[]): boolean {
  if (transactions.length < 5) return false;
  
  // Check if 5+ transactions within 1 hour
  const timeWindow = 60 * 60 * 1000; // 1 hour
  for (let i = 0; i < transactions.length - 4; i++) {
    const startTime = transactions[i].timestamp;
    const endTime = transactions[i + 4].timestamp;
    if (startTime - endTime <= timeWindow) {
      return true;
    }
  }
  
  return false;
}

function hasRoundAmounts(transactions: any[]): boolean {
  const roundAmounts = transactions.filter(tx => {
    const amount = parseFloat(tx.value || tx.valueInUSD || '0');
    return amount > 0 && amount % 1000 === 0; // Round thousands
  });
  
  return roundAmounts.length > transactions.length * 0.3; // 30% threshold
}

function calculateRiskMetrics(transactions: any[], patterns: any[]): any {
  return {
    patternRisk: patterns.length * 0.2,
    volumeRisk: calculateVolumeRisk(transactions),
    frequencyRisk: calculateFrequencyRisk(transactions),
    overallRisk: Math.min((patterns.length * 0.2 + calculateVolumeRisk(transactions) + calculateFrequencyRisk(transactions)) / 3, 1)
  };
}

function calculateVolumeRisk(transactions: any[]): number {
  const totalVolume = transactions.reduce((sum, tx) => {
    return sum + parseFloat(tx.value || tx.valueInUSD || '0');
  }, 0);
  
  // Risk increases with volume (simplified)
  if (totalVolume > 1000000) return 0.8;
  if (totalVolume > 100000) return 0.6;
  if (totalVolume > 10000) return 0.4;
  return 0.2;
}

function calculateFrequencyRisk(transactions: any[]): number {
  if (transactions.length > 100) return 0.8;
  if (transactions.length > 50) return 0.6;
  if (transactions.length > 20) return 0.4;
  return 0.2;
}

function countUniqueCounterparties(transactions: any[]): number {
  const counterparties = new Set();
  transactions.forEach(tx => {
    if (tx.from) counterparties.add(tx.from);
    if (tx.to) counterparties.add(tx.to);
  });
  return counterparties.size;
}

function calculateTimespan(transactions: any[]): any {
  if (transactions.length === 0) return null;
  
  const timestamps = transactions.map(tx => tx.timestamp || tx.blockTime * 1000);
  const earliest = Math.min(...timestamps);
  const latest = Math.max(...timestamps);
  
  return {
    earliest: new Date(earliest).toISOString(),
    latest: new Date(latest).toISOString(),
    spanDays: Math.round((latest - earliest) / (24 * 60 * 60 * 1000))
  };
}

function calculateTotalVolume(transactions: any[]): string {
  const total = transactions.reduce((sum, tx) => {
    return sum + parseFloat(tx.value || tx.valueInUSD || '0');
  }, 0);
  
  return total.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
}

export default router;
