package com.ttc.fleet360.services;

import com.ttc.fleet360.dto.BranchDto;
import com.ttc.fleet360.dto.CreateBranchRequest;
import com.ttc.fleet360.entities.Branch;
import com.ttc.fleet360.entities.BranchUser;
import com.ttc.fleet360.entities.User;
import com.ttc.fleet360.exceptions.BadRequestException;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.BranchRepository;
import com.ttc.fleet360.repositories.BranchUserRepository;
import com.ttc.fleet360.repositories.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BranchService {

    private final BranchRepository branchRepository;
    private final BranchUserRepository branchUserRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public BranchService(BranchRepository branchRepository,
                         BranchUserRepository branchUserRepository,
                         UserRepository userRepository,
                         AuditLogService auditLogService) {
        this.branchRepository = branchRepository;
        this.branchUserRepository = branchUserRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    public Page<BranchDto> searchBranches(String search, String status, Pageable pageable) {
        return branchRepository.searchBranches(search, status, pageable).map(this::mapToDto);
    }

    public List<BranchDto> getAllBranchesList() {
        return branchRepository.findAll().stream().map(this::mapToDto).toList();
    }

    public BranchDto getBranchById(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id " + id));
        return mapToDto(branch);
    }

    @Transactional
    public BranchDto createBranch(CreateBranchRequest req) {
        if (branchRepository.existsByBranchCode(req.getBranchCode())) {
            throw new BadRequestException("Branch code already exists: " + req.getBranchCode());
        }

        Branch branch = new Branch();
        branch.setBranchCode(req.getBranchCode());
        branch.setBranchName(req.getBranchName());
        branch.setCity(req.getCity());
        branch.setState(req.getState());
        branch.setCountry(req.getCountry() != null ? req.getCountry() : "India");
        branch.setPostalCode(req.getPostalCode());
        branch.setAddressLine(req.getAddressLine());
        branch.setContactEmail(req.getContactEmail());
        branch.setContactPhone(req.getContactPhone());
        branch.setStatus(req.getStatus() != null ? req.getStatus() : "ACTIVE");
        branch.setTotalVehicles(req.getTotalVehicles() != null ? req.getTotalVehicles() : 0);

        Branch saved = branchRepository.save(branch);
        auditLogService.logActivity("admin", "CREATE", "BRANCHES", saved.getId().toString(),
                "Created new branch " + saved.getBranchName() + " (" + saved.getBranchCode() + ")", "127.0.0.1", "SUCCESS");

        return mapToDto(saved);
    }

    @Transactional
    public BranchDto updateBranch(Long id, CreateBranchRequest req) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id " + id));

        if (req.getBranchName() != null) branch.setBranchName(req.getBranchName());
        if (req.getCity() != null) branch.setCity(req.getCity());
        if (req.getState() != null) branch.setState(req.getState());
        if (req.getCountry() != null) branch.setCountry(req.getCountry());
        if (req.getPostalCode() != null) branch.setPostalCode(req.getPostalCode());
        if (req.getAddressLine() != null) branch.setAddressLine(req.getAddressLine());
        if (req.getContactEmail() != null) branch.setContactEmail(req.getContactEmail());
        if (req.getContactPhone() != null) branch.setContactPhone(req.getContactPhone());
        if (req.getStatus() != null) branch.setStatus(req.getStatus());
        if (req.getTotalVehicles() != null) branch.setTotalVehicles(req.getTotalVehicles());

        Branch updated = branchRepository.save(branch);
        auditLogService.logActivity("admin", "UPDATE", "BRANCHES", updated.getId().toString(),
                "Updated branch details - " + updated.getBranchName(), "127.0.0.1", "SUCCESS");

        return mapToDto(updated);
    }

    @Transactional
    public void deleteBranch(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id " + id));
        branchRepository.delete(branch);
        auditLogService.logActivity("admin", "DELETE", "BRANCHES", id.toString(),
                "Deleted branch " + branch.getBranchName(), "127.0.0.1", "SUCCESS");
    }

    @Transactional
    public void assignUserToBranch(Long branchId, Long userId, String role) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id " + branchId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        branchUserRepository.findByBranchIdAndUserId(branchId, userId).ifPresentOrElse(
                existing -> {
                    existing.setAssignmentRole(role != null ? role : "STAFF");
                    branchUserRepository.save(existing);
                },
                () -> {
                    BranchUser bu = new BranchUser(branch, user, role != null ? role : "STAFF");
                    branchUserRepository.save(bu);
                }
        );
        auditLogService.logActivity("admin", "ASSIGN", "BRANCHES", branchId.toString(),
                "Assigned user " + user.getFullName() + " to branch " + branch.getBranchName(), "127.0.0.1", "SUCCESS");
    }

    private BranchDto mapToDto(Branch b) {
        BranchDto dto = new BranchDto();
        dto.setId(b.getId());
        dto.setBranchCode(b.getBranchCode());
        dto.setBranchName(b.getBranchName());
        dto.setCity(b.getCity());
        dto.setState(b.getState());
        dto.setCountry(b.getCountry());
        dto.setPostalCode(b.getPostalCode());
        dto.setAddressLine(b.getAddressLine());
        dto.setContactEmail(b.getContactEmail());
        dto.setContactPhone(b.getContactPhone());
        dto.setStatus(b.getStatus());
        dto.setTotalVehicles(b.getTotalVehicles());
        dto.setCreatedAt(b.getCreatedAt());

        int count = branchUserRepository.findByBranchId(b.getId()).size();
        dto.setAssignedUserCount(count);
        return dto;
    }
}
