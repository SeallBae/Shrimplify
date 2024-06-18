export interface RiskFactor {
  threshold: {
    low: number;
    high: number;
  };
  preventionScenarios: string[];
}

export interface ShrimpQualityAttribute {
  temperature: number;
  pH: number;
  dissolvedOxygen: number;
  nitrate: number;
  ammonia: number;
  salinity: number;
  conductivity: number;
  turbidity: number;
}

export interface ShrimpPredictorResponse {
  high: string;
  low: string;
  normal: string;
}

export interface ShrimpQualityPredictor {
  riskFactors: {
    [key: string]: RiskFactor;
  };

  predictRisk: (attributes: ShrimpQualityAttribute) => ShrimpPredictorResponse;

  proposePreventionScenarios: (attributes: ShrimpQualityAttribute) => string[];
}

export const shrimpQualityPredictor: ShrimpQualityPredictor = {
  riskFactors: {
    temperature: {
      threshold: {
        low: 25,
        high: 35,
      },
      preventionScenarios: [
        "Implement temperature control measures to maintain optimal range.",
        "Use shading or cooling systems to regulate temperature during hot periods.",
      ],
    },
    pH: {
      threshold: {
        low: 6.5,
        high: 8.5,
      },
      preventionScenarios: [
        "Monitor and adjust pH levels using appropriate buffering agents.",
        "Implement aeration to maintain dissolved oxygen and pH balance.",
      ],
    },
    dissolvedOxygen: {
      threshold: {
        low: 4,
        high: NaN,
      },
      preventionScenarios: [
        "Improve aeration and oxygenation in the shrimp habitat.",
        "Regularly monitor and maintain dissolved oxygen levels.",
      ],
    },
    nitrate: {
      threshold: {
        low: NaN,
        high: 15,
      },
      preventionScenarios: [
        "Implement proper water filtration and nutrient management techniques.",
        "Reduce nitrate levels through water exchange or biofiltration methods.",
      ],
    },
    ammonia: {
      threshold: {
        low: NaN,
        high: 0.5,
      },
      preventionScenarios: [
        "Enhance filtration and water exchange to reduce ammonia levels.",
        "Monitor feed quantities and adjust feeding practices to minimize ammonia buildup.",
      ],
    },
    salinity: {
      threshold: {
        low: 15,
        high: 30,
      },
      preventionScenarios: [
        "Monitor and adjust salinity levels through proper water mixing or dilution.",
        "Implement natural or artificial seawater for salinity regulation.",
      ],
    },
    conductivity: {
      threshold: {
        low: 100,
        high: 500,
      },
      preventionScenarios: [
        "Regularly monitor and adjust conductivity levels.",
        "Implement proper water treatment and filtration techniques to maintain conductivity within the optimal range.",
      ],
    },
    turbidity: {
      threshold: {
        low: 0,
        high: 5,
      },
      preventionScenarios: [
        "Implement proper filtration systems to remove suspended particles and maintain optimal turbidity levels.",
        "Regularly monitor and manage nutrient inputs to prevent excessive turbidity.",
      ],
    },
  },

  predictRisk: function (
    attributes: ShrimpQualityAttribute
  ): ShrimpPredictorResponse {
    let highRiskFactors: string[] = [];
    let lowRiskFactors: string[] = [];
    let normalRiskFactors: string[] = [];

    for (let factor in this.riskFactors) {
      const shrimpQuality = this.riskFactors[factor];
      const attribute = attributes[factor as keyof ShrimpQualityAttribute];
      if (
        !isNaN(shrimpQuality.threshold.high) &&
        shrimpQuality.threshold.high < attribute
      ) {
        highRiskFactors.push(factor);
      } else if (
        !isNaN(shrimpQuality.threshold.low) &&
        shrimpQuality.threshold.low > attribute
      ) {
        lowRiskFactors.push(factor);
      } else {
        normalRiskFactors.push(factor);
      }
    }

    return {
      high:
        "High risk due to: " +
        (highRiskFactors.length ? highRiskFactors.join(", ") : "None of them"),
      low:
        "Low risk due to: " +
        (lowRiskFactors.length ? lowRiskFactors.join(", ") : "None of them"),
      normal:
        "Normal risk due to: " +
        (normalRiskFactors.length
          ? normalRiskFactors.join(", ")
          : "None of them"),
    };
  },

  proposePreventionScenarios: function (
    attributes: ShrimpQualityAttribute
  ): string[] {
    const preventionScenarios: string[] = [];

    for (let factor in this.riskFactors) {
      const currentFactor = this.riskFactors[factor];
      const attribute = attributes[factor as keyof ShrimpQualityAttribute];
      if (
        !isNaN(currentFactor.threshold.high) &&
        currentFactor.threshold.high < attribute
      ) {
        preventionScenarios.push(...currentFactor.preventionScenarios);
      } else if (
        !isNaN(currentFactor.threshold.low) &&
        currentFactor.threshold.low > attribute
      ) {
        preventionScenarios.push(...currentFactor.preventionScenarios);
      }
    }

    return preventionScenarios;
  },
};

// predictor = ShrimpQualityPredictor();

// temperature = 33;
// pH = 7.8;
// dissolved_oxygen = 3;
// nitrate = 20;
// ammonia = 0.6;
// salinity = 25;

// risk_prediction = predictor.predict_risk(
//   temperature,
//   pH,
//   dissolved_oxygen,
//   nitrate,
//   ammonia,
//   salinity
// );
// print("Risk Prediction:", risk_prediction);

// prevention_scenarios = predictor.propose_prevention_scenarios(
//   temperature,
//   pH,
//   dissolved_oxygen,
//   nitrate,
//   ammonia,
//   salinity
// );
// print("Prevention Scenarios:", prevention_scenarios);
