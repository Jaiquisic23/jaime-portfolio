---
title: "Sensemaking in Production: Understanding the Problem"
summary: "A reflection on sensemaking in production: questioning assumptions about a workflow and separating what an incident reveals from what remains uncertain."
date: '2026-10-15'
slug: sensemaking-in-production
---

Much of my work investigating production incidents involves reconstructing what happened. I might start with a ticket describing symptoms reported by users, then compare that account with database records, logs and code. Alongside that technical work, conversations with people who understand the functional and business context can help complete the picture.

I am currently reading Crisis Engineering: Time-Tested Tools for Turning Chaos into Clarity, by Marina Nitze, Matthew Weaver and Mikey Dickerson. It has prompted me to reflect on what sensemaking means in my own work: how I build an understanding of a problem, and what might make me reconsider it.

In Crisis Engineering, the discussion of sensemaking draws on Karl Weick’s work alongside Daniel Kahneman’s distinction between two modes of thinking. Kahneman’s System 1 is fast and automatic; System 2 involves slower, deliberate effort to examine information and weigh evidence. That effort can still begin from an incorrect assumption.

I think of familiar interpretations as a kind of mental cache. In routine work, a recognised pattern can lead me to reuse an existing understanding without examining it again.

The book presents Weick’s sensemaking as continuous and often automatic, operating both individually and socially. It is shaped by how we understand ourselves and by the cues we select and interpret from our surroundings. We look back to make sense of what has happened, while our actions also help shape the situation we are trying to understand. The process favours plausibility over accuracy: an account can make sense to us without being true.

Stopping to question an interpretation is part of that process too. As the book puts it:

> Sensemaking kicks into overdrive when we can no longer operate in autopilot

For me, this is a reminder to recognise when I need to stop and reconsider what I think I know, including asking for another perspective.

Some months ago, I was investigating an issue in a contracting workflow that depended on an earlier simulation process. Some contracting flows required an additional review, leaving them pending for several days. When users tried to resume contracting, they found that they could not continue, and the logs recorded a handled error indicating that the simulation had expired.

Our shared understanding was that the simulation process should close as soon as contracting began. We spent days investigating the code and business rules and testing along the wrong lines before stopping to seek advice from experts about the workflow.

They explained that the simulation needed to remain open until contracting was completed. Closing it earlier would prevent contracting from continuing. We checked that explanation against successful contracting flows and found that the simulation remained open while contracting was in progress.

In summary, what we had considered incorrect was consistent with the intended workflow. Looking back, we could have spent time developing changes that closed the simulation at the start of contracting, which would have prevented those contracts from being completed.

The conversation, supported by comparison with successful flows, helped us correct that premise. Our investigation had involved deliberate effort, but our understanding of the expected behaviour still needed revising.

After reviewing the problem, I discovered that the expiry date associated with the simulation process was missing in most of the affected cases. We reproduced this behaviour in several tests. Our analysis identified how the missing date could lead the batch to expire simulations while contracting was still pending.

After clarifying the workflow, I applied a patch to the batch responsible for expiring simulations. When the expiry date was missing, the batch assigned the date specified by the business rules before applying the expiry logic.

Before the patch, roughly 40% of contracting flows requiring an additional review were affected. We observed this over approximately two months, with around 350 such flows per month. The percentage was based on database checks of the failures we were correcting each day.

In the most recent three-month period after the patch, we found eight affected cases out of approximately 900 contracting flows that followed the same path, about 0.9%.

These figures come from different periods rather than a controlled comparison. They show a much lower proportion of affected flows, but do not establish that the patch alone accounts for the entire difference. I also estimate that I now spend around an hour less each day on manual corrections.

The patch does not cover contracting workflows that remain pending for more than ten days, and the additional review can take longer than that. We checked the eight remaining cases and confirmed that they involved the same expiry problem in flows that exceeded this limit. I am now working towards a solution that addresses the cause of the missing expiry date.

This case makes me question what I am taking from my mental cache when I begin an investigation. A shared assumption can remain in the background even while we make a deliberate effort to understand the code. I need to recognise when to reconsider that assumption and test it against the evidence.

We understand the workflow better and have evidence of fewer failures. The cause of the missing expiry date remains unresolved.

Related reading: [It Works Today. What Happens Six Months from Now?](/en/articles/it-works-today-six-months-from-now)
