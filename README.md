A personal project I use for calculating my own tax liability over course of the year as part of my tax planning.

Remember to:
- Update tax year
- Save off data

### To run

`yarn dev`

### Recent Changes

- **1099/Business Income Support**: Added support for non-W2 business income with automatic Self-Employment (SE) tax calculation.
- **Work Income Tab**: Consolidates W2, 1099, and Option Exercises into a single unified "Work Income" interface.
- **Schedule SE Integration**: Implemented full Social Security and Medicare tax calculations for self-employed individuals, including the deductible portion of SE tax.
- **Form 8959 Part II**: Added support for additional Medicare tax on self-employment income.

### TODOs

- Extract and test Schedule AI (Estimated Payments) logic from component to utility/form class
- Tax withholdings calendar
- Form 6251 - AMT
- Pub 963 - Mortgage interest
- California tax calculator

### Attributions

- icon https://www.flaticon.com/ cah nggunung