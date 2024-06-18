import React, { useState } from "react";
import ShrimpButton from "../base/ShrimpButton";
import SetStatRange from "../form/SetStatRange";

export interface Props {
    user: any;
}

export default function General({ user }: Props){
    return(
    <div className="general">
    <div className="title">Information about Shrimp's enviroment</div>
        <div className="">
        Shrimp's surroundings has a significant impact on their general health and wellbeing. 
        Shrimp are greatly impacted by four main factors: temperature, pH, dissolved oxygen (DO), 
        and nitrate levels. Let's examine each quality and talk about the appropriate ranges for shrimp.
          <ol>
            <li>
              <strong>Temperature</strong>: Because they are ectothermic species, 
              the environment around shrimp affects the temperature of their bodies. 
              Whatever the type, shrimp like different temperatures, but generally speaking, 
              they need to be between 20°C and 30°C (68°F and 86°F). 
              Maintaining a consistent temperature within this range 
              is crucial for promoting the shrimp's ideal development, metabolism, 
              and general physiological processes.
            </li>
            <li>
              <strong>pH</strong>: The term pH describes how acidic or basic the water is. 
              pH levels between slightly alkaline and neutral are ideal for shrimp growth. 
              For the majority of shrimp species, the ideal pH range is normally 
              between 7.0 and 8.5. In order to support healthy enzyme activity, 
              food absorption, and osmoregulation in shrimp, the right pH level must be maintained.
            </li>
            <li>
              <strong>Dissolved Oxygen (DO)</strong>: For their ability to breathe, 
              shrimp need a sufficient amount of dissolved oxygen in the water. 
              While certain species may be able to withstand lower or higher amounts, 
              the usual range of acceptable dissolved oxygen levels for shrimp 
              is between 5 mg/L and 8 mg/L. Stress, stunted development, 
              and heightened disease susceptibility can result from inadequate 
              oxygen levels, but high oxygen levels can also be harmful. In shrimp ponds or tanks, 
              proper aeration and water movement are essential for maintaining the right DO levels.
            </li>
            <li>
              <strong>Nitrate</strong>: One kind of nitrogen that can build up 
              in water owing to overfeeding and organic waste is nitrate.
              Elevated nitrate concentrations can be detrimental to shrimp, 
              leading to stunted development, compromised immune systems, 
              and heightened vulnerability to illnesses. Nitrate levels should 
              be kept below 50 mg/L, and preferably, below 20 mg/L, by using effective 
              filtration, frequent water exchange, and sensible feeding procedures.
            </li>
          </ol>
        </div>

        <div className="warning">
          *All the above information is personal research
        </div>
    </div>
    )
}