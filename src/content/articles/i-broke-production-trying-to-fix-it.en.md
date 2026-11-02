---
title: "I broke production trying to fix it"
summary: "A search query change overloaded a production database. I explain the rollback, the limits of our tests and the decisions behind the incident."
homeSummary: "My search query change passed initial tests but overloaded the production database. I write about what happened and the decisions behind it."
date: '2026-11-02'
slug: i-broke-production-trying-to-fix-it
---

Last week, I broke a client's production database while trying to fix a search panel.

What was supposed to be a performance improvement ended up saturating the database, slowing down the system and triggering timeouts during contract processing. As a result, operations teams struggled to use the search panel, while other business processes began failing for reasons that initially seemed unrelated.

By Monday afternoon, we had to roll back my entire implementation to restore normal operation.

I was responsible for the change, and I had made a serious mistake. Yet, as I looked back at the decisions that led to the incident, I realised that the most valuable lesson went beyond SQL optimisation or testing.

## How It All Started

The problem began with a search panel that had been causing recurring timeouts, preventing operations teams from performing certain searches. Since my team was responsible for production maintenance, finding a solution was part of our job.

After exploring several approaches, we worked closely with an experienced tech lead who helped us redesign the query. Over several meetings, we reviewed different alternatives and adjusted the Java code responsible for dynamically building the SQL based on multiple search filters. Eventually, we settled on a new structure using a base query and Common Table Expressions (CTEs).

Although other priorities interrupted the development for a few weeks, I eventually completed the implementation and tested it in our non-production environments. The searches returned the expected results, the filters worked correctly, and I documented the test evidence before deploying the changes on Thursday evening.

What I hadn't fully considered was that our testing databases contained only a fraction of the data available in production. Moreover, despite having involved the tech leads throughout the initial development, I hadn't requested a final review before deployment.

## When One Query Affects an Entire System

By Friday morning, problems were already emerging. Our database monitoring system identified the new query as the source of excessive load, leaving the search panel unusable and putting considerable pressure on the database.

At the time, we believed the impact was limited to the panel itself and the increased database load, without realising that other business processes were also being affected. We therefore planned to correct the query rather than revert the changes. However, since deploying a correction on a Friday was complicated by our production release procedures, we decided to leave it until the following week.

By Monday, however, the database was so heavily saturated that the situation had become much more critical. I initially started working on a correction, but restoring normal operation had become the priority. During discussions with the tech leads, we also learned that another team was already building a replacement for the entire search panel. Given that our implementation would soon be replaced, they asked us to abandon further corrections and roll back all the changes.

I prepared the rollback, which we deployed that Monday afternoon, restoring normal operation.

In the following days, we also discovered that the impact had extended to contract processing throughout Friday and Monday. Users had continued attempting searches through the panel, repeatedly executing the expensive query and adding further pressure to the database.

Using Grafana, we identified API response times exceeding the agreed SLAs, while the API logs confirmed delays of several additional seconds during contract processing. Combined with database monitoring, which showed the excessive load caused by the search query, this allowed us to trace the contract-processing failures back to the same incident.

As a result, some contracts had failed to complete successfully and required subsequent corrections. By then, the incident had also escalated to management, who wanted to understand what had happened.

## The Missing Context

Beyond the technical failure, the incident made me question whether developing such a complex solution had been the right decision in the first place.

During our initial discussions, the tech leads had mentioned that changes to the search panel were being considered. However, we were never given a clear picture of their scope or timeline, so we continued working on our solution to address the ongoing production issue.

It wasn't until Monday, when we discussed how to address the incident, that we learned another team was already working on a complete replacement expected within weeks. If we had known that earlier, we could have reconsidered our approach, perhaps opting for a smaller temporary fix or coordinating more closely with the other team.

None of this changes my responsibility for the incident. The lack of coordination didn't cause the database saturation; my implementation did. However, knowing about the replacement earlier could have changed our decision to develop such a complex solution.

## What I Learned

Looking back, I realise that I was so focused on solving the technical problem that I didn't spend enough time questioning the approach we were taking. We had an issue affecting production, and naturally, my priority was to fix it.

I also trusted functional tests that couldn't reproduce production conditions and deployed a significant change without requesting a final technical review. Going forward, I intend to be more careful about what our tests actually validate and involve the tech leads before deploying changes with potentially wider consequences.

Ultimately, this experience taught me that **good engineering is as much about deciding what is worth building as it is about knowing how to build it.**
