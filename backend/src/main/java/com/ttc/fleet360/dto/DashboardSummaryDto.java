package com.ttc.fleet360.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDto {
    // KPI Cards
    private long totalUsers;
    private double usersGrowthPercent;

    private long totalBranches;
    private double branchesGrowthPercent;

    private long activeFleet;
    private double fleetGrowthPercent;

    private long totalSubscriptions;
    private double subscriptionsGrowthPercent;

    // Fleet Performance Chart (Last 6 Months)
    private List<String> months;
    private List<Integer> totalTripsSeries;
    private List<Integer> onTimeDeliverySeries;

    // Branch Distribution
    private List<BranchDistributionItem> branchDistribution;

    // Recent Activities
    private List<ActivityItem> recentActivities;

    // Subscription Tiers Overview
    private List<SubscriptionPlanDto> subscriptionPlans;

    // Upcoming Renewals
    private List<RenewalItem> upcomingRenewals;

    public DashboardSummaryDto() {}

    public static class BranchDistributionItem {
        private String city;
        private int percentage;
        private String color;

        public BranchDistributionItem() {}

        public BranchDistributionItem(String city, int percentage, String color) {
            this.city = city;
            this.percentage = percentage;
            this.color = color;
        }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public int getPercentage() { return percentage; }
        public void setPercentage(int percentage) { this.percentage = percentage; }

        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }

    public static class ActivityItem {
        private String title;
        private String description;
        private String timeAgo;
        private String statusBadge;
        private String badgeVariant; // new, updated, success, info

        public ActivityItem() {}

        public ActivityItem(String title, String description, String timeAgo, String statusBadge, String badgeVariant) {
            this.title = title;
            this.description = description;
            this.timeAgo = timeAgo;
            this.statusBadge = statusBadge;
            this.badgeVariant = badgeVariant;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getTimeAgo() { return timeAgo; }
        public void setTimeAgo(String timeAgo) { this.timeAgo = timeAgo; }

        public String getStatusBadge() { return statusBadge; }
        public void setStatusBadge(String statusBadge) { this.statusBadge = statusBadge; }

        public String getBadgeVariant() { return badgeVariant; }
        public void setBadgeVariant(String badgeVariant) { this.badgeVariant = badgeVariant; }
    }

    public static class RenewalItem {
        private String title;
        private String company;
        private String expiryBadge;
        private String badgeColor; // red, orange, blue

        public RenewalItem() {}

        public RenewalItem(String title, String company, String expiryBadge, String badgeColor) {
            this.title = title;
            this.company = company;
            this.expiryBadge = expiryBadge;
            this.badgeColor = badgeColor;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }

        public String getExpiryBadge() { return expiryBadge; }
        public void setExpiryBadge(String expiryBadge) { this.expiryBadge = expiryBadge; }

        public String getBadgeColor() { return badgeColor; }
        public void setBadgeColor(String badgeColor) { this.badgeColor = badgeColor; }
    }

    // Getters and Setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public double getUsersGrowthPercent() { return usersGrowthPercent; }
    public void setUsersGrowthPercent(double usersGrowthPercent) { this.usersGrowthPercent = usersGrowthPercent; }

    public long getTotalBranches() { return totalBranches; }
    public void setTotalBranches(long totalBranches) { this.totalBranches = totalBranches; }

    public double getBranchesGrowthPercent() { return branchesGrowthPercent; }
    public void setBranchesGrowthPercent(double branchesGrowthPercent) { this.branchesGrowthPercent = branchesGrowthPercent; }

    public long getActiveFleet() { return activeFleet; }
    public void setActiveFleet(long activeFleet) { this.activeFleet = activeFleet; }

    public double getFleetGrowthPercent() { return fleetGrowthPercent; }
    public void setFleetGrowthPercent(double fleetGrowthPercent) { this.fleetGrowthPercent = fleetGrowthPercent; }

    public long getTotalSubscriptions() { return totalSubscriptions; }
    public void setTotalSubscriptions(long totalSubscriptions) { this.totalSubscriptions = totalSubscriptions; }

    public double getSubscriptionsGrowthPercent() { return subscriptionsGrowthPercent; }
    public void setSubscriptionsGrowthPercent(double subscriptionsGrowthPercent) { this.subscriptionsGrowthPercent = subscriptionsGrowthPercent; }

    public List<String> getMonths() { return months; }
    public void setMonths(List<String> months) { this.months = months; }

    public List<Integer> getTotalTripsSeries() { return totalTripsSeries; }
    public void setTotalTripsSeries(List<Integer> totalTripsSeries) { this.totalTripsSeries = totalTripsSeries; }

    public List<Integer> getOnTimeDeliverySeries() { return onTimeDeliverySeries; }
    public void setOnTimeDeliverySeries(List<Integer> onTimeDeliverySeries) { this.onTimeDeliverySeries = onTimeDeliverySeries; }

    public List<BranchDistributionItem> getBranchDistribution() { return branchDistribution; }
    public void setBranchDistribution(List<BranchDistributionItem> branchDistribution) { this.branchDistribution = branchDistribution; }

    public List<ActivityItem> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<ActivityItem> recentActivities) { this.recentActivities = recentActivities; }

    public List<SubscriptionPlanDto> getSubscriptionPlans() { return subscriptionPlans; }
    public void setSubscriptionPlans(List<SubscriptionPlanDto> subscriptionPlans) { this.subscriptionPlans = subscriptionPlans; }

    public List<RenewalItem> getUpcomingRenewals() { return upcomingRenewals; }
    public void setUpcomingRenewals(List<RenewalItem> upcomingRenewals) { this.upcomingRenewals = upcomingRenewals; }
}
