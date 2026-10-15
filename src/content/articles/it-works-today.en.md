---
title: "It Works Today. What Happens Six Months from Now?"
summary: "On production systems and the importance of noticing when our assumptions stop holding true."
homeSummary: "A process can finish without an exception and still leave the wrong data behind. I write about the batch controls I added to help find those gaps."
date: '2026-09-12'
slug: it-works-today-six-months-from-now
relatedWork:
  title: "Recovering contracts after a batch failure"
  href: "/en/experience#batch-recovery"
  summary: "A Java defect left over 3,000 contracts incorrectly suspended. I fixed the process and added a filtered recovery that we later reused."
---

When fixing a problem in production, it is easy to focus solely on stopping the failure. You find the cause, make the change, and verify that it works—but what happens to that solution in six months, a year, or three years? What happens when others modify the system and combinations arise that we aren't currently accounting for?

For instance, I have encountered personalized offers created during the sign-up process that affect contract pricing. An error in one of these offers can alter database information; if this accumulates silently, it could crash the renewal system a year later—or result in the loss of commissions, surcharges of up to 75%, or a discount that should have been applied. Yet, the sign-up process completes successfully; we don't see an exception, the contract is generated, and—on the surface—nothing has gone wrong. The system doesn't trigger any alarms, but your company might be losing money or accumulating contracts with errors that could lead to further issues.

The risk lies in this behaviour repeating undetected. One case turns into a hundred, then a thousand, and three months later, you could be facing tens of thousands of affected contracts. At that point, simply fixing the root cause isn't enough; you have to identify the problem, prepare and deploy a hotfix, and simultaneously develop a data fix to correct the erroneous contracts. It becomes a race against time with an impact that extends beyond the technical realm, affecting operations and customer relationships.

Experiences like this have made me place much greater importance on controls. A situation like the one described can be difficult to foresee during development, but its impact can be drastically reduced if there is a mechanism capable of early detection—identifying contracts that have entered a state inconsistent with business rules. Controls do not fix the root cause, nor do they replace proper implementation, testing, or reviews. They simply reduce the time gap between when our assumptions cease to hold true and the moment we realize it. Implementing controls is as straightforward as understanding how the product is supposed to behave; it requires an understanding of business processes. For example:

Onboarding funnel → Rate calculation → Invoice generation → Signed document custody process.

If we implement controls—such as one that flags contracts with a zero rate in our database—we can quickly detect that the rate calculation process is malfunctioning.

All of this has changed the way I investigate problems. I try not to ask myself only what needs to be modified to stop the issue from recurring, but also what other parts of the system are involved, what assumptions we are making, and what might happen if any of those assumptions change. Sometimes this means looking beyond the immediate fix to consider the broader solution; at other times, it involves gaining a better understanding of a dependency or recognizing the need for a control we didn't have before.

Six months from now, someone else might modify that part of the system. A business rule might change, a new integration might be introduced, or we might encounter a scenario we hadn't anticipated. I don't know what will happen then, and assuming we can foresee everything would be a mistake. What I do hope is that whoever comes next can understand the reasoning behind certain decisions and that, if any of our assumptions prove invalid, we have a way to discover it before the consequences compound.