package com.ttc.fleet360.dto;

import java.time.Instant;

public class SystemSettingDto {
    private Long id;
    private String settingKey;
    private String settingValue;
    private String settingGroup;
    private String description;
    private String valueType;
    private Boolean isPublic;
    private Instant updatedAt;

    public SystemSettingDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSettingKey() { return settingKey; }
    public void setSettingKey(String settingKey) { this.settingKey = settingKey; }

    public String getSettingValue() { return settingValue; }
    public void setSettingValue(String settingValue) { this.settingValue = settingValue; }

    public String getSettingGroup() { return settingGroup; }
    public void setSettingGroup(String settingGroup) { this.settingGroup = settingGroup; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getValueType() { return valueType; }
    public void setValueType(String valueType) { this.valueType = valueType; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
