function timeNormalizer(periodType, time) {
  let timeMultiplier;

  switch (periodType) {
    case 'days':
      timeMultiplier = 1;
      break;
    case 'weeks':
      timeMultiplier = 7;
      break;
    case 'months':
      timeMultiplier = 30;
      break;
    default:
      timeMultiplier = 1;
  }

  return time * timeMultiplier;
}

function estimate(infected, days, doublerate) {
  return infected * 2 ** Math.trunc(days / doublerate);
}

const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    timeToElapse,
    periodType,
    totalHospitalBeds: bed,
    region: { avgDailyIncomeInUSD: avgInc, avgDailyIncomePopulation: avgIncPop }
  } = data;

  const daysToDouble = 3;

  const day = timeNormalizer(periodType, timeToElapse);

  const output = {
    data,
    impact: {
      currentlyInfected: 0,
      infectionsByRequestedTime: 0,
      severeCasesByRequestedTime: 0,
      hospitalBedsByRequestedTime: 0,
      casesForICUByRequestedTime: 0,
      casesForVentilatorsByRequestedTime: 0,
      dollarsInFlight: 0
    },
    severeImpact: {
      currentlyInfected: 0,
      infectionsByRequestedTime: 0,
      severeCasesByRequestedTime: 0,
      hospitalBedsByRequestedTime: 0,
      casesForICUByRequestedTime: 0,
      casesForVentilatorsByRequestedTime: 0,
      dollarsInFlight: 0
    }
  };

  // Challenge 1
  output.impact.currentlyInfected = reportedCases * 10;
  output.severeImpact.currentlyInfected = reportedCases * 50;
  output.impact.infectionsByRequestedTime = estimate(
    output.impact.currentlyInfected,
    day,
    daysToDouble
  );
  output.severeImpact.infectionsByRequestedTime = estimate(
    output.severeImpact.currentlyInfected,
    day,
    daysToDouble
  );

  // Challenge 2
  output.impact.severeCasesByRequestedTime = Math.trunc(
    output.impact.infectionsByRequestedTime * 0.15
  );
  output.severeImpact.severeCasesByRequestedTime = Math.trunc(
    output.severeImpact.infectionsByRequestedTime * 0.15
  );
  output.impact.hospitalBedsByRequestedTime = Math.trunc(
    bed * 0.35 - output.impact.severeCasesByRequestedTime
  );
  output.severeImpact.hospitalBedsByRequestedTime = Math.trunc(
    bed * 0.35 - output.severeImpact.severeCasesByRequestedTime
  );

  // Challenge 3
  output.impact.casesForICUByRequestedTime = Math.trunc(
    output.impact.infectionsByRequestedTime * 0.05
  );
  output.severeImpact.casesForICUByRequestedTime = Math.trunc(
    output.severeImpact.infectionsByRequestedTime * 0.05
  );
  output.impact.casesForVentilatorsByRequestedTime = Math.trunc(
    output.impact.infectionsByRequestedTime * 0.02
  );
  output.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    output.severeImpact.infectionsByRequestedTime * 0.02
  );
  output.impact.dollarsInFlight = Math.trunc(
    (output.impact.infectionsByRequestedTime * avgInc * avgIncPop) / day
  );
  output.severeImpact.dollarsInFlight = Math.trunc(
    (output.severeImpact.infectionsByRequestedTime * avgInc * avgIncPop) / day
  );

  return output;
};

export default covid19ImpactEstimator;
